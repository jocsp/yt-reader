import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CliError, parseArgs, readVersion } from "../src/cli.js";

const url = "https://www.youtube.com/watch?v=joo9aKCdtJg";

describe("parseArgs", () => {
    it("parses a URL with default output", () => {
        expect(parseArgs([url])).toEqual({
            kind: "run",
            url,
            outputDir: "output",
        });
    });

    it.each(["-o", "--output"])("reads the output directory from %s", (flag) => {
        expect(parseArgs([flag, "transcripts", url])).toEqual({
            kind: "run",
            url,
            outputDir: "transcripts",
        });
    });

    it("reads --output=dir", () => {
        expect(parseArgs([`--output=transcripts`, url])).toEqual({
            kind: "run",
            url,
            outputDir: "transcripts",
        });
    });

    it.each(["-l", "--language", "--lang"])(
        "reads the language from %s",
        (flag) => {
            expect(parseArgs([flag, "es", url])).toEqual({
                kind: "run",
                url,
                outputDir: "output",
                lang: "es",
            });
        }
    );

    it("reads --language=code", () => {
        expect(parseArgs(["--language=fr", url])).toEqual({
            kind: "run",
            url,
            outputDir: "output",
            lang: "fr",
        });
    });

    it("allows flags after the URL", () => {
        expect(parseArgs([url, "-o", "out", "-l", "es"])).toEqual({
            kind: "run",
            url,
            outputDir: "out",
            lang: "es",
        });
    });

    it.each(["-h", "--help"])("returns help for %s", (flag) => {
        expect(parseArgs([flag])).toEqual({ kind: "help" });
        expect(parseArgs([url, flag])).toEqual({ kind: "help" });
    });

    it.each(["-v", "--version"])("returns version for %s", (flag) => {
        expect(parseArgs([flag])).toEqual({ kind: "version" });
    });

    it("throws when the URL is missing", () => {
        expect(() => parseArgs([])).toThrow(CliError);
        expect(() => parseArgs([])).toThrow("Please provide a YouTube URL.");
    });

    it("throws when a flag is missing its value", () => {
        expect(() => parseArgs(["--output"])).toThrow("Missing value for --output");
        expect(() => parseArgs(["-l"])).toThrow("Missing value for -l");
        expect(() => parseArgs(["--language="])).toThrow(
            "Missing value for --language"
        );
    });

    it("throws on an unknown option", () => {
        expect(() => parseArgs(["--silent", url])).toThrow("Unknown option: --silent");
        expect(() => parseArgs(["-lang", url])).toThrow("Unknown option: -lang");
    });

    it("throws when more than one URL is given", () => {
        expect(() => parseArgs([url, url])).toThrow(
            "Please provide a single YouTube URL."
        );
    });
});

describe("readVersion", () => {
    it("reads the version from package.json", () => {
        const packageJsonPath = join(
            dirname(fileURLToPath(import.meta.url)),
            "..",
            "package.json"
        );
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
            version: string;
        };

        expect(readVersion()).toBe(pkg.version);
    });
});
