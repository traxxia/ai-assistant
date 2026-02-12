import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Analysis } from '../../models/analysis.model';

export const getAnalysisContextTool = createTool({
  id: 'get-analysis-context',
  description: 'Get the full analysis context for a business. Use this when the user asks for a general overview or summary.',
  inputSchema: z.object({
    businessId: z.string().describe('The business ID to fetch analysis for'),
  }),
  outputSchema: z.array(z.any()), // flexible output as it returns the raw analysis documents
  execute: async ({ businessId }) => {
    console.log('[Tool] Triggered: getAnalysisContextTool for businessId:', businessId);
    return await Analysis.getAll(businessId);
  },
});

export const getAnalysisByTypeTool = createTool({
  id: 'get-analysis-by-type',
  description: 'Get a specific type of analysis for a business. Use this when the user asks for a specific analysis (e.g. SWOT, PESTEL, etc.)',
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
    return await Analysis.findByType(businessId, analysisType);
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
    return await Analysis.getByPhase(businessId, phase);
  },
});
