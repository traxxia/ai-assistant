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
    return await Analysis.getAll(businessId);
  },
});
