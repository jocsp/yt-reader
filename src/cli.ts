import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_OUTPUT_DIR = "output";

export class CliError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CliError";
    }
}

export type CliAction =
    | { kind: "help" }
    | { kind: "version" }
    | { kind: "run"; url: string; outputDir: string; lang?: string };

export const usage = `Usage: yt-reader [options] <youtube-url>

Fetch a YouTube video transcript and save it as a text file.

Options:
  -o, --output <dir>         Directory to write the transcript (default: output)
  -l, --language <code>      Caption language code (for example: en, es, fr)
      --lang <code>          Alias for --language
  -h, --help                 Show this help
  -v, --version              Show version`;

export function parseArgs(argv: string[]): CliAction {
    let outputDir = DEFAULT_OUTPUT_DIR;
    let lang: string | undefined;
    let url: string | undefined;

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === undefined) {
            break;
        }

        if (arg === "--help" || arg === "-h") {
            return { kind: "help" };
        }

        if (arg === "--version" || arg === "-v") {
            return { kind: "version" };
        }

        const output = takeOptionValue(arg, argv, i, ["--output", "-o"]);
        if (output) {
            outputDir = output.value;
            i = output.lastIndex;
            continue;
        }

        const language = takeOptionValue(arg, argv, i, [
            "--language",
            "--lang",
            "-l",
        ]);
        if (language) {
            lang = language.value;
            i = language.lastIndex;
            continue;
        }

        if (arg.startsWith("-")) {
            throw new CliError(`Unknown option: ${arg}`);
        }

        if (url !== undefined) {
            throw new CliError("Please provide a single YouTube URL.");
        }

        url = arg;
    }

    if (url === undefined) {
        throw new CliError("Please provide a YouTube URL.");
    }

    if (lang === undefined) {
        return { kind: "run", url, outputDir };
    }

    return { kind: "run", url, outputDir, lang };
}

export function readVersion(): string {
    const packageJsonPath = join(
        dirname(fileURLToPath(import.meta.url)),
        "..",
        "package.json"
    );
    const data: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));

    if (!isPackageJson(data)) {
        throw new Error("Invalid package.json");
    }

    return data.version;
}

function takeOptionValue(
    arg: string,
    argv: string[],
    index: number,
    names: string[]
): { value: string; lastIndex: number } | undefined {
    for (const name of names) {
        if (arg === name) {
            const value = argv[index + 1];
            if (value === undefined || value.startsWith("-")) {
                throw new CliError(`Missing value for ${name}`);
            }
            return { value, lastIndex: index + 1 };
        }

        if (arg.startsWith(`${name}=`)) {
            const value = arg.slice(name.length + 1);
            if (value === "") {
                throw new CliError(`Missing value for ${name}`);
            }
            return { value, lastIndex: index };
        }
    }

    return undefined;
}

function isPackageJson(value: unknown): value is { version: string } {
    return (
        typeof value === "object" &&
        value !== null &&
        "version" in value &&
        typeof (value as { version: unknown }).version === "string"
    );
}
