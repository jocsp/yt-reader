export function getVideoId(videoUrl: string): string {
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

export function toFilenamePart(value: string): string {
    return value
        .trim()
        .replace(/[<>:"/\\|?*]+/g, "-")
        .replace(/(?:\s*-\s*)+/g, " - ")
        .replace(/\s+/g, " ")
        .replace(/^[ .-]+|[ .-]+$/g, "");
}

export function buildFilename(
    channelName: string,
    title: string,
    videoId: string
): string {
    return `${toFilenamePart(channelName)}__${toFilenamePart(title)}__${videoId}.txt`;
}
