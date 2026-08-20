import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchMetadata } from "./metadata.js";
import { fetchTranscriptText } from "./transcript.js";
import { buildFilename, getVideoId } from "./utils.js";

export async function saveTranscript(
    url: string,
    outputDir = "output"
): Promise<string> {
    const metadata = await fetchMetadata(url);
    const fullText = await fetchTranscriptText(url);
    const filename = buildFilename(
        metadata.channelName,
        metadata.title,
        getVideoId(url)
    );
    const filepath = join(outputDir, filename);

    await mkdir(outputDir, { recursive: true });
    await writeFile(filepath, fullText);

    return filepath;
}
