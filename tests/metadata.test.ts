import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchMetadata } from "../src/metadata.js";
import { oembedSuccess, videoUrl } from "./fixtures.js";
import { mockFetchJson } from "./helpers.js";

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("fetchMetadata", () => {
    it("maps a successful oEmbed response", async () => {
        mockFetchJson(oembedSuccess);

        await expect(fetchMetadata(videoUrl)).resolves.toEqual({
            title: oembedSuccess.title,
            channelName: oembedSuccess.author_name,
            channelUrl: oembedSuccess.author_url,
            thumbnailUrl: oembedSuccess.thumbnail_url,
        });
    });

    it("throws when the HTTP response is not ok", async () => {
        mockFetchJson({}, 404);

        await expect(fetchMetadata(videoUrl)).rejects.toThrow(
            "Failed to fetch metadata: 404"
        );
    });

    it.each([null, []])(
        "rejects a non-object metadata body: %j",
        async (body) => {
            mockFetchJson(body);

            await expect(fetchMetadata(videoUrl)).rejects.toThrow(
                "Invalid metadata response"
            );
        }
    );

    it("rejects an empty metadata object", async () => {
        mockFetchJson({});

        await expect(fetchMetadata(videoUrl)).rejects.toThrow(
            "Missing or invalid metadata field: title"
        );
    });

    it.each([
        [{ ...oembedSuccess, title: undefined }, "title"],
        [{ ...oembedSuccess, author_name: undefined }, "author_name"],
        [{ ...oembedSuccess, thumbnail_url: null }, "thumbnail_url"],
        [{ ...oembedSuccess, author_url: "" }, "author_url"],
    ])("rejects a missing or empty %s field", async (body, field) => {
        mockFetchJson(body);

        await expect(fetchMetadata(videoUrl)).rejects.toThrow(
            `Missing or invalid metadata field: ${field}`
        );
    });
});
