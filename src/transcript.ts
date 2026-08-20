import { fetchTranscript } from "youtube-transcript";

export interface TranscriptFragment {
    text: string;
}

export function joinTranscript(fragments: TranscriptFragment[]): string {
    return fragments.map((fragment) => fragment.text).join(" ");
}

export async function fetchTranscriptText(
    videoUrl: string,
    lang = "en"
): Promise<string> {
    const fragments = await fetchTranscript(videoUrl, { lang });

    if (fragments.length === 0) {
        throw new Error("No transcript found for this video");
    }

    return joinTranscript(fragments);
}
