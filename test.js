const hello = await fetch(
    "http://localhost:3000/"
);

console.log('hello: \n\n', await hello.text());

const response = await fetch(
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
);

const content = await response.arrayBuffer();

const payload = {
    content
}

console.log('content: \n\n', content);

const AIResponse = await fetch(
    "http://localhost:3000/speech-to-text",
    {
        body: content,
        method: 'POST',
        headers: {
            // 'Content-type': 'application/json',
            'Content-type': 'text/plain',
        }
    }
);

const AIResponseText = await AIResponse.text();

console.log('AIResponse: \n\n', AIResponseText);

const AIResponse2 = await fetch(
    "http://localhost:3000/text-to-speech",
    {
        body: AIResponseText,
        method: 'POST',
        headers: {
            // 'Content-type': 'application/json',
            'Content-type': 'text/plain',
        }
    }
);

console.log('AIResponse2: \n\n', await AIResponse2.arrayBuffer());