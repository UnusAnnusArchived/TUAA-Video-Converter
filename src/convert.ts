import getDimensions from "get-video-dimensions";
import { Transcoder } from "../node_modules/simple-hls/src/index";
import presetRenditions from "./renditions";
import type { Rendition } from "./renditions";
import fs from "fs";
import getAudioBitrate from "./tools/getAudioBitrate";

const possibleHeights = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320];

const roundToTwo = (number: number) => {
  return Math.round(number / 2) * 2;
};

const convert = async (file: string) => {
  process.on("uncaughtException", () => {
    fs.appendFileSync("errors.txt", `Error processing ${file}`);
  });

  const { width: originalWidth, height: originalHeight } =
    await getDimensions(file);
  const heightsToUse = [];
  for (let i = 0; i < possibleHeights.length; i++) {
    if (originalHeight >= possibleHeights[i]) {
      heightsToUse.push(possibleHeights[i]);
    } else if (i < possibleHeights[i]) {
      break;
    }
  }

  if (heightsToUse.length < 1) {
    throw new Error("Error finding usable resolutions");
  }

  const aspectRatio = originalWidth / originalHeight;

  const audioBitrate = await getAudioBitrate(file);

  console.log(audioBitrate);

  const renditions = heightsToUse.map((height) => {
    return {
      ...presetRenditions[height],
      width: roundToTwo(height * aspectRatio),
      height,
      ba: Math.round(audioBitrate / 1000).toString() + "k",
    } as Rendition;
  });

  let folderNameSplit = file.split(".");
  folderNameSplit.pop();

  const folderName = folderNameSplit.join(".");

  if (fs.existsSync(folderName)) {
    throw new Error("Folder already exists! Delete the folder to continue.");
  }

  fs.mkdirSync(folderName);

  const transcoder = new Transcoder(file, folderNameSplit.join("."), {
    renditions,
  });
  await transcoder.transcode();
};

// ffmpeg -i "c:/videos/sample.mp4"
// -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0
// -c:v libx264 -crf 22 -c:a aac -ar 48000
// -filter:v:0 scale=w=480:h=360  -maxrate:v:0 600k -b:a:0 64k
// -filter:v:1 scale=w=640:h=480  -maxrate:v:1 900k -b:a:1 128k
// -filter:v:2 scale=w=1280:h=720 -maxrate:v:2 900k -b:a:2 128k
// -var_stream_map "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p"
// -preset slow -hls_list_size 0 -threads 0 -f hls -hls_playlist_type event -hls_time 3
// -hls_flags independent_segments -master_pl_name "name-pl.m3u8"
// "c:/videos/encoded/name-%v.m3u8"

export default convert;
