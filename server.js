const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // To load the API key from the .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and serve static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));  // Serve static files from the "public" directory

// Initialize the Google Generative AI API with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to handle recipe generation
app.post('/generate-recipe', async (req, res) => {
    const ingredients = req.body.ingredients;

    try {
        const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}`;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        res.json({ recipe: result.response.text() });
    } catch (error) {
        console.error('Error generating recipe:', error.message);
        res.status(500).json({ error: 'An error occurred while generating the recipe' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
