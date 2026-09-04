#!/usr/bin/env node
import { saveTranscript } from "./app.js";
import { CliError, parseArgs, readVersion, usage } from "./cli.js";

try {
    const action = parseArgs(process.argv.slice(2));

    if (action.kind === "help") {
        console.log(usage);
        process.exit(0);
    }

    if (action.kind === "version") {
        console.log(readVersion());
        process.exit(0);
    }

    const filepath = await saveTranscript(
        action.url,
        action.outputDir,
        action.lang
    );
    console.log(`Saved transcript to ${filepath}`);
} catch (error) {
    if (error instanceof CliError) {
        console.error(error.message);
        console.error("Try 'yt-reader --help' for usage.");
        process.exit(1);
    }

    console.error("Failed to fetch transcript:");
    console.error(error);
    process.exit(1);
}
