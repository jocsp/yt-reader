import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchTranscript } from "youtube-transcript";
import { fetchMetadata } from "./metadata.js";

const url = process.argv[2];

if (!url) {
    console.error("Please provide a YouTube URL.");
    process.exit(1);
}

try {
    const metadata = await fetchMetadata(url);
    const transcript = await fetchTranscript(url, {
        lang: "en",
    });
    const fullText = transcript.map((fragment) => fragment.text).join(" ");

    const filename = `${toFilenamePart(metadata.channelName)}__${toFilenamePart(metadata.title)}__${getVideoId(url)}.txt`;
    const filepath = join("output", filename);

    await mkdir("output", { recursive: true });
    await writeFile(filepath, fullText);

    console.log(`Saved transcript to ${filepath}`);
} catch (error) {
    console.error("Failed to fetch transcript:");
    console.error(error);
}

function getVideoId(videoUrl: string): string {
    const parsed = new URL(videoUrl);
    const fromQuery = parsed.searchParams.get("v");

    if (fromQuery) {
        return fromQuery;
    }

    // Path segments with empty pieces from leading/trailing slashes removed.
    const parts = parsed.pathname.split("/").filter((part) => part !== "");
    // youtu.be/ID uses the first segment; other hosts (embed, shorts, …) use the last.
    const id = parsed.hostname === "youtu.be" ? parts[0] : parts.at(-1);

    if (!id) {
        throw new Error("Could not extract video ID from URL");
    }

    return id;
}

function toFilenamePart(value: string): string {
    return value
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "-")
        .replace(/(?:\s*-\s*)+/g, " - ")
        .replace(/\s+/g, " ")
        .replace(/^[ .-]+|[ .-]+$/g, "");
}
