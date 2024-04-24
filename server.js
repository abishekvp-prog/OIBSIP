const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const { Configuration, OpenAIApi } = require('openai');
const { Configuration, OpenAIApi } = require('openai');
// Configure OpenAI API
const configuration = new Configuration({
    apiKey: 'sk-proj-06GFA7WOv2wRdSO2XA0GT3BlbkFJmIbZImLkCDQDaoxOebOG',
});
const openai = new OpenAIApi(configuration);

// Serve static files
app.use(express.static('public'));

// Parse JSON request bodies
app.use(bodyParser.json());

// Route to handle the GPT request
app.post('/gpt', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const completion = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.5,
        });

        const response = completion.data.choices[0].text;
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});