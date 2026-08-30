import {
    fetchTranscript,
    YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript";

export interface TranscriptFragment {
    text: string;
}

export function joinTranscript(fragments: TranscriptFragment[]): string {
    return fragments.map((fragment) => fragment.text).join(" ");
}

export async function fetchTranscriptText(
    videoUrl: string,
    lang?: string
): Promise<string> {
    const fragments = lang
        ? await fetchTranscript(videoUrl, { lang })
        : await fetchTranscriptPreferEnglish(videoUrl);

    if (fragments.length === 0) {
        throw new Error("No transcript found for this video");
    }

    return joinTranscript(fragments);
}

async function fetchTranscriptPreferEnglish(videoUrl: string) {
    try {
        return await fetchTranscript(videoUrl, { lang: "en" });
    } catch (error) {
        if (error instanceof YoutubeTranscriptNotAvailableLanguageError) {
            return fetchTranscript(videoUrl);
        }

        throw error;
    }
}
