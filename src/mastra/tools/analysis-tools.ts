import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Analysis } from '../../models/analysis.model';

// Helper to strip internal DB fields before passing to the LLM
const sanitizeData = (data: any | any[]) => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => sanitizeItem(item));
  return sanitizeItem(data);
};

const sanitizeItem = (item: any) => {
  if (!item) return item;
  // Deep clone to ensure we aren't mutating mongoose docs and can delete keys
  const clean = JSON.parse(JSON.stringify(item));
  delete clean._id;
  delete clean.business_id;
  delete clean.user_id;
  delete clean.created_at;
  delete clean.updated_at;
  delete clean.__v;
  return clean;
};

export const getAnalysisContextTool = createTool({
  id: 'get-analysis-context',
  description: 'Get the full analysis context for a business. Use this when the user asks for a general overview or summary.',
  inputSchema: z.object({
    businessId: z.string().describe('The business ID to fetch analysis for'),
  }),
  outputSchema: z.array(z.any()), // flexible output as it returns the raw analysis documents
  execute: async ({ businessId }) => {
    console.log('[Tool] Triggered: getAnalysisContextTool for businessId:', businessId);
    return sanitizeData(await Analysis.getAll(businessId));
  },
});

export const getAnalysisByTypeTool = createTool({
  id: 'get-analysis-by-type',
  description: 'Get a specific type of analysis for a business. Use this when the user asks for a specific analysis (e.g. SWOT, PESTEL, etc.). CRITICAL INSTRUCTION: If the user asks for general "growth opportunities" or "growth", DO NOT assume they mean "growthTracker". You should instead pull "swot", "fullSwot", or use "getAnalysisContext" to find growth insights. Only use "growthTracker" if they explicitly say "Tracker".',
  inputSchema: z.object({
    analysisType: z.enum([
      'swot',
      'purchaseCriteria',
      'loyaltyNPS',
      'porters',
      'pestel',
      'fullSwot',
      'competitiveAdvantage',
      'expandedCapability',
      'strategicRadar',
      'productivityMetrics',
      'maturityScore',
      'competitiveLandscape',
      'coreAdjacency',
      'profitabilityAnalysis',
      'growthTracker',
      'liquidityEfficiency',
      'investmentPerformance',
      'leverageRisk'
    ]).describe('The specific type of analysis to fetch'),
    businessId: z.string().describe('The business ID to fetch analysis for'),
  }),
  outputSchema: z.any(),
  execute: async ({ businessId, analysisType }) => {
    console.log(`[Tool] Triggered: getAnalysisByTypeTool for type: ${analysisType} and businessId: ${businessId}`);
    
    let data = await Analysis.findByType(businessId, analysisType);
    
    // Smart Fallback logic inside the tool itself
    if (!data) {
        if (analysisType === 'swot') {
            console.log(`[Tool] 'swot' not found, falling back to 'fullSwot'`);
            data = await Analysis.findByType(businessId, 'fullSwot');
        } else if (analysisType === 'fullSwot') {
            console.log(`[Tool] 'fullSwot' not found, falling back to 'swot'`);
            data = await Analysis.findByType(businessId, 'swot');
        } else if (analysisType === 'growthTracker') {
            // If the LLM still incorrectly guessed growthTracker, fall back to swot/fullSwot for opportunities
            console.log(`[Tool] 'growthTracker' not found, falling back to 'fullSwot' to find growth opportunities`);
            data = await Analysis.findByType(businessId, 'fullSwot') || await Analysis.findByType(businessId, 'swot');
        }
    }

    if (!data) {
        return { error: `Requested analysis type '${analysisType}' is not available.` };
    }
    return sanitizeData(data);
  },
});

export const getAnalysisByPhaseTool = createTool({
  id: 'get-analysis-by-phase',
  description: 'Get analysis data filtered by phase (initial, essential, good, advanced).',
  inputSchema: z.object({
    phase: z.enum(['initial', 'essential', 'good', 'advanced']).describe('The phase to filter analysis by'),
    businessId: z.string().describe('The business ID to fetch analysis for'),
  }),
  outputSchema: z.any(),
  execute: async ({ businessId, phase }) => {
    console.log(`[Tool] Triggered: getAnalysisByPhaseTool for phase: ${phase} and businessId: ${businessId}`);
    const data = await Analysis.getByPhase(businessId, phase);
    if (!data || data.length === 0) {
        return { message: `No analysis found for phase '${phase}'.` };
    }
    return sanitizeData(data);
  },
});
