export interface YouTubeMetadata {
    title: string;
    channelName: string;
    channelUrl: string;
    thumbnailUrl: string;
}

export async function fetchMetadata(
    videoUrl: string
): Promise<YouTubeMetadata> {
    const endpoint =
        `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch metadata: ${response.status}`
        );
    }

    const data: unknown = await response.json();

    if (!isRecord(data)) {
        throw new Error("Invalid metadata response");
    }

    return {
        title: readString(data.title, "title"),
        channelName: readString(data.author_name, "author_name"),
        channelUrl: readString(data.author_url, "author_url"),
        thumbnailUrl: readString(data.thumbnail_url, "thumbnail_url"),
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, field: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Missing or invalid metadata field: ${field}`);
    }

    return value;
}
