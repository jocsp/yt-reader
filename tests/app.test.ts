import { mkdtemp, readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fetchTranscript } from "youtube-transcript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveTranscript } from "../src/app.js";
import { oembedSuccess, videoUrl } from "./fixtures.js";
import { mockFetchJson } from "./helpers.js";

vi.mock("youtube-transcript", () => ({
    fetchTranscript: vi.fn(),
}));

const fetchTranscriptMock = vi.mocked(fetchTranscript);

beforeEach(() => {
    fetchTranscriptMock.mockReset();
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("saveTranscript", () => {
    it("writes the joined transcript using the expected filename", async () => {
        mockFetchJson(oembedSuccess);
        fetchTranscriptMock.mockResolvedValue([
            { text: "Hello", duration: 1, offset: 0 },
            { text: "this is", duration: 1, offset: 1 },
            { text: "a video", duration: 1, offset: 2 },
        ]);

        const outputDir = await mkdtemp(join(tmpdir(), "yt-reader-"));
        const filepath = await saveTranscript(videoUrl, outputDir);

        expect(filepath).toBe(
            join(
                outputDir,
                "TheStandupPod__Is Vibe Coding a Game - Standup #68__joo9aKCdtJg.txt"
            )
        );
        await expect(readFile(filepath, "utf8")).resolves.toBe(
            "Hello this is a video"
        );
        expect(fetchTranscriptMock).toHaveBeenCalledWith(videoUrl, {
            lang: "en",
        });
    });

    it("does not write a file when the transcript is empty", async () => {
        mockFetchJson(oembedSuccess);
        fetchTranscriptMock.mockResolvedValue([]);

        const outputDir = await mkdtemp(join(tmpdir(), "yt-reader-"));

        await expect(saveTranscript(videoUrl, outputDir)).rejects.toThrow(
            "No transcript found for this video"
        );
        await expect(readdir(outputDir)).resolves.toEqual([]);
    });
});
