const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // To load the API key from the .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and serve static files
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize the Google Generative AI API with the API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Route to handle recipe generation
app.post('/generate-recipe', async (req, res) => {
    const ingredients = req.body.ingredients;

    try {
        // Create a prompt based on the user's ingredients
        const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}`;

        // Generate content using the Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);

        // Return the generated recipe text
        res.json({ recipe: result.response.text() });
    } catch (error) {
        console.error('Error generating recipe:', error.message);
        res.status(500).json({ error: 'An error occurred while generating the recipe' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


