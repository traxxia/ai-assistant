import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mastra } from './mastra';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4111;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const businessId = req.headers['x-business-id'] as string;
    const { message } = req.body;

    if (!businessId) {
      return res.status(400).json({ error: 'Missing x-business-id header' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Missing message in body' });
    }

    // Construct prompt with context
    const propmtWithContext = `${message}\n\n[System Context]: The Business ID is "${businessId}". Use this ID for any tool calls.`;

    console.log(`Processing request for Business ID: ${businessId}`);

    const agent = mastra.getAgent('analysisAgent');
    const result = await agent.generate(propmtWithContext);

    // Return the text response
    return res.json({ response: result.text });

  } catch (error: any) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
