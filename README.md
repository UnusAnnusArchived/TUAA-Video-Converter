# TUAA-Video-Converter

This tool converts mp4 files into our multi-resolution HLS streams.

The way it is set up, it will produce the following outputs:

- 144p @ 200k-500k
- 240p @ 350k-800k
- 360p @ 350k-1600k
- 480p @ 800k-2400k
- 720p @ 1200k-3800k
- 1080p @ 1900k-9000k
- 1440p @ 4500k-18000k
- 2160p @ 9000k-24000k
- 4320p @ 12000k-40000k

These can be configured in the `src/renditions.ts` file.

## Bun

This tool is written with bun, and does not seem to work well with node. I'm running this on a Windows PC with WSL for TUAA.

## Syntax

You can get command syntax by running

```shell
./tuaa-video-converter --help
```
