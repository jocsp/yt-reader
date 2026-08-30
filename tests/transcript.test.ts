import {
    fetchTranscript,
    YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchTranscriptText, joinTranscript } from "../src/transcript.js";
import { videoUrl } from "./fixtures.js";

vi.mock("youtube-transcript", async (importOriginal) => {
    const actual = await importOriginal<typeof import("youtube-transcript")>();
    return { ...actual, fetchTranscript: vi.fn() };
});

const fetchTranscriptMock = vi.mocked(fetchTranscript);

beforeEach(() => {
    fetchTranscriptMock.mockReset();
});

describe("joinTranscript", () => {
    it("joins fragment text with a single space", () => {
        expect(
            joinTranscript([
                { text: "Hello" },
                { text: "this is" },
                { text: "a video" },
            ])
        ).toBe("Hello this is a video");
    });
});

describe("fetchTranscriptText", () => {
    it("requests English captions by default", async () => {
        fetchTranscriptMock.mockResolvedValue([
            { text: "Hello", duration: 1, offset: 0 },
        ]);

        await fetchTranscriptText(videoUrl);

        expect(fetchTranscriptMock).toHaveBeenCalledWith(videoUrl, {
            lang: "en",
        });
    });

    it("passes through a custom language", async () => {
        fetchTranscriptMock.mockResolvedValue([
            { text: "Hola", duration: 1, offset: 0 },
        ]);

        await fetchTranscriptText(videoUrl, "es");

        expect(fetchTranscriptMock).toHaveBeenCalledWith(videoUrl, {
            lang: "es",
        });
    });

    it("throws when there are no transcript fragments", async () => {
        fetchTranscriptMock.mockResolvedValue([]);

        await expect(fetchTranscriptText(videoUrl)).rejects.toThrow(
            "No transcript found for this video"
        );
    });

    it("falls back to the first available language when English is missing", async () => {
        fetchTranscriptMock
            .mockRejectedValueOnce(
                new YoutubeTranscriptNotAvailableLanguageError(
                    "en",
                    ["es"],
                    "jneRRBXeUgg"
                )
            )
            .mockResolvedValueOnce([
                { text: "Hola", duration: 1, offset: 0 },
            ]);

        await expect(fetchTranscriptText(videoUrl)).resolves.toBe("Hola");

        expect(fetchTranscriptMock).toHaveBeenNthCalledWith(1, videoUrl, {
            lang: "en",
        });
        expect(fetchTranscriptMock).toHaveBeenNthCalledWith(2, videoUrl);
    });

    it("does not fall back for other transcript errors", async () => {
        fetchTranscriptMock.mockRejectedValueOnce(new Error("network down"));

        await expect(fetchTranscriptText(videoUrl)).rejects.toThrow(
            "network down"
        );
        expect(fetchTranscriptMock).toHaveBeenCalledTimes(1);
    });
});
