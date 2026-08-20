# yt-reader

Fetches the English transcript of a YouTube video and saves it as a text file.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later
- A video with English captions available

## Installation

```bash
git clone <repo-url>
cd yt-reader
npm install
```

## Usage

Pass a YouTube URL to the `dev` script:

```bash
npm run dev -- "https://www.youtube.com/watch?v=VIDEO_ID"
```

The `--` is required so npm forwards the URL to the script.

## Output

Transcripts are written to `output/` as:

```
Channel Name__Video Title__VIDEO_ID.txt
```
