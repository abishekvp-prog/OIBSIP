const startSpeakingButton = document.getElementById('startSpeaking');
const outputDiv = document.getElementById('output');

startSpeakingButton.addEventListener('click', async () => {
    try {
        const voiceText = await recognizeSpeech();
        if (voiceText) {
            const response = await sendPromptToGPT(voiceText);
            outputDiv.textContent = response;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function recognizeSpeech() {
    return new Promise((resolve, reject) => {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Set the language for speech recognition

        recognition.onstart = () => {
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Transcript:', transcript);
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            reject(event.error);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
        };

        recognition.start();
    });
}

async function sendPromptToGPT(prompt) {
    const response = await fetch('/gpt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.response;
}