import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import moment from "moment";

const createSeekImages = (file: string, rate: number) => {
  return new Promise<string>((resolve) => {
    let folderNameSplit = file.split(".");
    folderNameSplit.pop();

    const rootFolder = folderNameSplit.join(".");

    if (!fs.existsSync(rootFolder)) {
      fs.mkdirSync(rootFolder);
    }

    const seekFolder = path.join(rootFolder, "seek");

    if (fs.existsSync(seekFolder)) {
      throw new Error(
        "Seek folder already exists! Delete the folder to continue",
      );
    }

    fs.mkdirSync(seekFolder);

    console.log("Creating seek images...");

    ffmpeg(file)
      .outputFPS(1 / rate)
      .output(path.join(seekFolder, "%06d.jpg"))
      .videoFilter("scale=150x84")
      .on("start", (command) => {
        console.log(command);
      })
      .on("progress", (progress) => {
        console.log(progress);
      })
      .on("end", () => {
        console.log("Finished creating seek images");
        resolve(seekFolder);
      })
      .run();
  });
};

export const createSeekMetadata = (
  seekFolder: string,
  rate: number,
  rootUrl: string,
) => {
  const listing = fs.readdirSync(seekFolder);

  let vtt = "WEBVTT\n";

  const vttTimeFormat = "HH:mm:ss.SSS";

  for (let i = 0; i < listing.length; i++) {
    const fromSeconds = rate * i;
    const toSeconds = rate * (i + 1);

    vtt += `\n${i + 1}\n${moment(fromSeconds * 1000)
      .utc()
      .format(vttTimeFormat)} --> ${moment(toSeconds * 1000)
      .utc()
      .format(
        vttTimeFormat,
      )}\n${rootUrl}/${(i + 1).toString().padStart(6, "0")}.jpg\n`;
  }

  fs.writeFileSync(path.join(seekFolder, "seek.vtt"), vtt);
};

export default createSeekImages;
