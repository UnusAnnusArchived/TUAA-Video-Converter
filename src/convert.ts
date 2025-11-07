import getDimensions from "get-video-dimensions";
import { Transcoder } from "../node_modules/simple-hls/src/index";
import presetRenditions from "./renditions";
import type { Rendition } from "./renditions";
import fs from "fs";
import getAudioBitrate from "./tools/getAudioBitrate";

const possibleWidths = [256, 426, 640, 854, 1280, 1920, 2560, 3840, 7680];

const roundToTwo = (number: number) => {
  return Math.round(number / 2) * 2;
};

const convert = async (file: string) => {
  process.on("uncaughtException", () => {
    fs.appendFileSync("errors.txt", `Error processing ${file}`);
  });

  const { width: originalWidth, height: originalHeight } = await getDimensions(file);
  console.log(originalWidth, originalHeight);
  const widthsToUse = [];
  for (let i = 0; i < possibleWidths.length; i++) {
    if (originalWidth >= possibleWidths[i]) {
      widthsToUse.push(possibleWidths[i]);
    } else if (i < possibleWidths[i]) {
      break;
    }
  }

  console.log(widthsToUse.join(", "));

  if (widthsToUse.length < 1) {
    throw new Error("Error finding usable resolutions");
  }

  const aspectRatio = originalWidth / originalHeight;

  const audioBitrate = await getAudioBitrate(file);

  console.log(audioBitrate);

  const renditions = widthsToUse.map((width) => {
    return {
      ...presetRenditions[width],
      width,
      height: roundToTwo(width / aspectRatio),
      ts_title: roundToTwo(width / 1.7777777778).toString(),
      master_title: roundToTwo(width / 1.7777777778).toString(),
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

  return folderName;
};

export default convert;
