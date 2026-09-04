# yt-reader

Fetches the English transcript of a YouTube video and saves it as a text file.

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
```

Transcripts are written to `output/` in the current directory as:

```
Channel Name__Video Title__VIDEO_ID.txt
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
