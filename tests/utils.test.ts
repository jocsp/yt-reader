import { describe, expect, it } from "vitest";
import { buildFilename, getVideoId, toFilenamePart } from "../src/utils.js";

describe("getVideoId", () => {
    it.each([
        "https://www.youtube.com/watch?v=joo9aKCdtJg",
        "https://youtu.be/joo9aKCdtJg",
        "https://www.youtube.com/shorts/joo9aKCdtJg",
        "https://www.youtube.com/embed/joo9aKCdtJg",
        "https://youtu.be/joo9aKCdtJg?si=abc123",
        "https://www.youtube.com/watch?v=joo9aKCdtJg&t=120",
    ])("extracts the video ID from %s", (url) => {
        expect(getVideoId(url)).toBe("joo9aKCdtJg");
    });

    it("throws when the URL has no video ID", () => {
        expect(() => getVideoId("https://youtube.com/")).toThrow(
            "Could not extract video ID from URL"
        );
    });

    it("throws when the input is not a URL", () => {
        expect(() => getVideoId("not-a-url")).toThrow();
    });
});

describe("toFilenamePart", () => {
    it("replaces unsafe characters and collapses adjacent separators", () => {
        expect(toFilenamePart("Is Vibe Coding a Game? | Standup #68")).toBe(
            "Is Vibe Coding a Game - Standup #68"
        );
    });

    it.each([
        ["Hello????World", "Hello - World"],
        ["Hello?|||***World", "Hello - World"],
        ["Hello / World", "Hello - World"],
        ['"Hello: World?"', "Hello - World"],
    ])("sanitizes %s", (input, expected) => {
        expect(toFilenamePart(input)).toBe(expected);
    });

    it("keeps characters that are safe in filenames", () => {
        expect(toFilenamePart("¿Qué pasó aquí?")).toBe("¿Qué pasó aquí");
        expect(toFilenamePart("Café & Código #12")).toBe("Café & Código #12");
        expect(toFilenamePart("日本語のタイトル")).toBe("日本語のタイトル");
        expect(toFilenamePart("Hello (Part 2)!")).toBe("Hello (Part 2)!");
    });
});

describe("buildFilename", () => {
    it("combines channel, title, and video ID", () => {
        expect(
            buildFilename(
                "TheStandupPod",
                "Is Vibe Coding a Game? | Standup #68",
                "joo9aKCdtJg"
            )
        ).toBe(
            "TheStandupPod__Is Vibe Coding a Game - Standup #68__joo9aKCdtJg.txt"
        );
    });
});
