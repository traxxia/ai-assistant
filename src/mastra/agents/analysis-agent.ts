import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getAnalysisContextTool, getAnalysisByTypeTool } from '../tools/analysis-tools';

export const analysisAgent = new Agent({
  id: 'analysis-agent',
  name: 'Analysis Agent',
  instructions: `
      You are an analysis assistant helper.
      Your primary goal is to fetch and present analysis data for a specific business.
      
      When asked for analysis, a summary, or context about the business:
      1. If the user asks for a general summary, use the "get-analysis-context" tool.
      2. If the user asks for a specific analysis (e.g., SWOT, PESTEL, etc.), use the "get-analysis-by-type" tool with the correct type.
      3. If the user asks for MULTIPLE analyses (e.g., "SWOT and PESTEL"), call the "get-analysis-by-type" tool MULTIPLE times (once for each type).
      4. If the tool returns data, present it clearly to the user.
      5. If no data is found, inform the user politely.
      6. NEVER mention the "Business ID" or "ID" in your response to the user. It is internal system information.
`,
  model: 'groq/llama-3.3-70b-versatile', //LLM model
  tools: { getAnalysisContextTool, getAnalysisByTypeTool },
  memory: new Memory(),
});
