import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Project } from '../../models/projects.model';

export const getProjectsTool = createTool({
  id: 'get-projects',
  description: 'Get all projects associated with a business. Use this when the user asks about projects, initiatives, or strategic plans.',
  inputSchema: z.object({
    businessId: z.string().describe('The business ID to fetch projects for'),
  }),
  outputSchema: z.array(z.any()),
  execute: async ({ businessId }) => {
    console.log('[Tool] Triggered: getProjectsTool for businessId:', businessId);
    return await Project.getByBusinessId(businessId);
  },
});
