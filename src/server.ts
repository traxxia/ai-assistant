import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import cors from 'cors';
import { mastra } from './mastra';

console.log('Loaded GROQ_API_KEY:', process.env.GROQ_API_KEY?.substring(0, 10) + '...');

const app = express();
const PORT = process.env.PORT || 4111;

app.use(cors());
app.use(express.json());

// Uptime monitor endpoint
app.get('/api/uptime', (req, res) => {
  res.json({ message: 'agent is online' });
});


app.post('/api/chat', async (req, res) => {
  try {
    const businessId = req.headers['x-business-id'] as string;
    const { message, projectId } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing x-business-id header' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Missing message in body' });
    }

    // Construct prompt with context
    let systemContext = `[System Context]: The Business ID is "${businessId}". Use this ID for any tool calls.`;
    
    if (projectId) {
      systemContext += `\n[System Context]: The user is asking about a SPECIFIC Project with ID "${projectId}". Use this "projectId" for the "get-answer-project" tool.`;
    }

    const propmtWithContext = `${message}\n\n${systemContext}`;

    console.log(`Processing request for Business ID: ${businessId}`);

    const agent = mastra.getAgent('analysisAgent');
    const result = await agent.generate(propmtWithContext);

    console.log('[AI Response]:', result.text);
    console.log('[AI Usage]:', result.usage);

    // Return the text response and token usage
    return res.json({ 
      response: result.text,
      usage: result.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    });

  } catch (error: any) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

console.log('Starting server...');

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
    
    // Force close if it takes too long
    setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Keep process alive explicitly (workaround for premature exit in some environments)
setInterval(() => {}, 1000 * 60 * 60);

process.stdin.resume();


