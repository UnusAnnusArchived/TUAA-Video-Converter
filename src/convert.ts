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

  const { width: originalWidth, height: originalHeight } = await getDimensions(file);
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

export default convert;
