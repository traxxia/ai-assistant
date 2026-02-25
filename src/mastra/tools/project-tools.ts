import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Project } from '../../models/projects.model';

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

export const getProjectsTool = createTool({
  id: 'getProjects',
  description: 'Get all projects associated with a business. Use this when the user asks about projects, initiatives, or strategic plans.',
  inputSchema: z.object({
    businessId: z.string().describe('The business ID to fetch projects for'),
  }),
  outputSchema: z.any(),
  execute: async ({ businessId }) => {
    console.log('[Tool] Triggered: getProjectsTool for businessId:', businessId);
    const projects = await Project.getByBusinessId(businessId);
    if (!projects || projects.length === 0) {
        return { message: "No projects found for this business." };
    }
    return sanitizeData(projects);
  },
});

export const getAnswerProjectTool = createTool({
  id: 'get-answer-project',
  description: 'Get project details and related analysis data to answer specific questions about a project. Use this when the user asks about a SPECIFIC project and you have the projectId.',
  inputSchema: z.object({
    projectId: z.string().describe('The ID of the project to answer questions about'),
    businessId: z.string().describe('The business ID to fetch context for'),
    analysisType: z.string().optional().describe('Optional specific analysis type (e.g., swot) to focus on'),
  }),
  outputSchema: z.object({
    project: z.any(),
    analysis: z.any(),
    error: z.string().optional(),
  }),
  execute: async ({ projectId, businessId, analysisType }) => {
    console.log(`[Tool] Triggered: getAnswerProjectTool for projectId: ${projectId}, analysisType: ${analysisType}`);
    
    try {
      // 1. Fetch Project
      const project = await Project.getById(projectId);
      if (!project) {
        return { error: 'Project not found', project: null, analysis: null };
      }

      // 2. Fetch Analysis
      // We need to dynamically import Analysis to avoid circular deps if any
      const { Analysis } = await import('../../models/analysis.model');
      
      let analysisData;
      if (analysisType) {
        analysisData = await Analysis.findByType(businessId, analysisType);
      } else {
        // Fetch all context if no specific type requested
        analysisData = await Analysis.getAll(businessId);
      }

      if (analysisType && !analysisData) {
         return {
            project: sanitizeData(project),
            analysis: null,
            message: `Project data found, but '${analysisType}' analysis is not available.`
         };
      }

      return {
        project: sanitizeData(project),
        analysis: sanitizeData(analysisData),
      };
    } catch (error: any) {
      console.error('[Tool] Error in getAnswerProjectTool:', error);
      return { 
        error: `Failed to fetch project or analysis: ${error.message}`,
        project: null,
        analysis: null 
      };
    }
  },
});
