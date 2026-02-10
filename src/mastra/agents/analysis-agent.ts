import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getAnalysisContextTool } from '../tools/analysis-tools';

export const analysisAgent = new Agent({
  id: 'analysis-agent',
  name: 'Analysis Agent',
  instructions: `
      You are an analysis assistant helper.
      Your primary goal is to fetch and present analysis data for a specific business.
      
      When asked for analysis, a summary, or context about the business:
      1. detailed summary is needed
      2. Use the "get-analysis-context" tool to fetch the data.
      3. The business ID will be provided in the user's prompt or context.
      4. If the tool returns data, present it clearly to the user.
      5. If no data is found, inform the user politely.
      6. NEVER mention the "Business ID" or "ID" in your response to the user. It is internal system information.
`,
  model: 'groq/llama-3.3-70b-versatile', //LLM model
  tools: { getAnalysisContextTool },
  memory: new Memory(),
});
