# YouTube Video Summarizer

A simple Node.js application that extracts transcripts from YouTube videos and generates key point summaries using Claude AI.

## Setup

1. Install Ollama (completely free, runs locally):
   - Download from: https://ollama.ai
   - After installation, start it with: `ollama serve`
   - In another terminal, pull a model: `ollama pull mistral`

2. Install Python dependencies:
```bash
py -m pip install youtube-transcript-api
```

3. Install Node dependencies:
```bash
npm install
```

## Usage

Run the application:
```bash
npm start
```

Then enter a YouTube URL or video ID when prompted:
- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

The app will:
1. Extract the video transcript using Python
2. Send it to Claude for summarization
3. Display 5-7 key points

## Requirements

- Node.js 16+
- Python 3.6+
- youtube-transcript-api (Python package)
- Ollama (free, runs locally)
- YouTube video must have captions available

## How to Run

1. Start Ollama in one terminal:
```bash
ollama serve
```

2. In another terminal, run the app:
```bash
npm start
```

3. Enter a YouTube URL when prompted
