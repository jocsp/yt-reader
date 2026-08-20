import { saveTranscript } from "./app.js";

const url = process.argv[2];

if (!url) {
    console.error("Please provide a YouTube URL.");
    process.exit(1);
}

try {
    const filepath = await saveTranscript(url);
    console.log(`Saved transcript to ${filepath}`);
} catch (error) {
    console.error("Failed to fetch transcript:");
    console.error(error);
}
