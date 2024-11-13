const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(userMessage);
    const botMessage = result.response.text();

    res.json({ botMessage });
  } catch (error) {
    console.error('Error with Gemini API:', error.response ? error.response.data : error.message);
    res.status(500).json({ botMessage: 'Error: Unable to fetch response from API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});