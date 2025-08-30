// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware to parse JSON and serve static files from the 'public' directory
app.use(express.json());
app.use(express.static('public'));

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the API endpoint for code reviews
app.post('/review', async (req, res) => {
  try {
    const { code } = req.body; // Get the code from the request body

    if (!code) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are an expert code reviewer AI assistant working for "L•E•V•I•'s Code Quality".
      Your task is to review a snippet of code and provide constructive feedback.
      Focus on potential bugs, performance issues, security vulnerabilities, and adherence to best practices.
      Provide your feedback in a clear, concise, and easy-to-read markdown format.
      If there are no issues, simply state that the code looks good.
      
      Review the following code:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    // Send the AI's feedback back to the frontend
    res.json({ feedback });

  } catch (error) {
    console.error('Error during code review:', error);
    res.status(500).json({ error: 'Failed to get review from AI.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});