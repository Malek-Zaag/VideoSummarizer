import axios from 'axios';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getTranscript(videoUrl) {
  try {
    const result = execSync(`py get_transcript.py "${videoUrl}"`, { encoding: 'utf-8' });
    const data = JSON.parse(result);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.transcript;
  } catch (error) {
    throw new Error(`Could not fetch transcript: ${error.message}`);
  }
}

async function summarizeWithOllama(transcript) {
  try {
    // Truncate transcript to avoid token limits
    const maxChars = 8000;
    const truncatedTranscript = transcript.length > maxChars 
      ? transcript.substring(0, maxChars) + '...' 
      : transcript;

    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'mistral',
        prompt: `Summarize the following YouTube video transcript into 5-7 key points. Format as a numbered list:\n\n${truncatedTranscript}`,
        stream: false
      }
    );

    return response.data.response;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama is not running. Please start Ollama first: ollama serve');
    }
    if (error.response?.data) {
      throw new Error(`Ollama error: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Ollama error: ${error.message}`);
  }
}

async function summarizeVideo(videoUrl) {
  try {
    console.log('\n� Fetching transcript...');
    const transcript = await getTranscript(videoUrl);
    
    if (!transcript || transcript.length === 0) {
      throw new Error('Could not fetch transcript. Video may not have captions.');
    }

    console.log(`✅ Transcript fetched (${transcript.length} characters)\n`);
    console.log('📄 TRANSCRIPT:\n');
    console.log(transcript);
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('🤖 Generating summary with Ollama...');
    const summary = await summarizeWithOllama(transcript);
    
    console.log('\n📌 KEY POINTS:\n');
    console.log(summary);
    console.log('\n');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

function promptUser() {
  rl.question('Enter YouTube URL or video ID (or "exit" to quit): ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    if (input.trim()) {
      await summarizeVideo(input.trim());
    }
    
    promptUser();
  });
}

console.log('🎬 YouTube Video Summarizer');
console.log('============================');
console.log('Make sure Ollama is running (ollama serve)\n');

promptUser();
