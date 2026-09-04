# yt-reader

Fetches a YouTube video transcript and saves it as a text file. English captions are used when available; pass `--language` to pick another.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later
- A video with captions available (English is preferred; another language is used if English is missing)

## Install

```bash
npm install -g yt-reader
```

Or run once without installing:

```bash
npx yt-reader "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Usage

```bash
yt-reader "https://www.youtube.com/watch?v=VIDEO_ID"
yt-reader --output transcripts --language es "https://www.youtube.com/watch?v=VIDEO_ID"
```

Transcripts are written to `output/` in the current directory by default, as:

```
Channel Name__Video Title__VIDEO_ID.txt
```

```text
Usage: yt-reader [options] <youtube-url>

Options:
  -o, --output <dir>         Directory to write the transcript (default: output)
  -l, --language <code>      Caption language code (for example: en, es, fr)
      --lang <code>          Alias for --language
  -h, --help                 Show this help
  -v, --version              Show version
```

## Development

```bash
git clone https://github.com/jocsp/yt-reader.git
cd yt-reader
npm install
npm test
npm run build
```

Run from source without building:

```bash
npm run dev -- "https://www.youtube.com/watch?v=VIDEO_ID"
```
