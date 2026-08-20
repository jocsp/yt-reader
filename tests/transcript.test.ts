import { fetchTranscript } from "youtube-transcript";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchTranscriptText, joinTranscript } from "../src/transcript.js";
import { videoUrl } from "./fixtures.js";

vi.mock("youtube-transcript", () => ({
    fetchTranscript: vi.fn(),
}));

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
});
