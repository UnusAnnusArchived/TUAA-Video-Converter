import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const removeOriginalFiles = (file: string, disableCountdown?: boolean, thumbnail?: string) => {
  let timerInterval: NodeJS.Timeout;

  if (!disableCountdown) {
    console.log("THIS COMMAND IS DESTRUCTIVE AND WILL DELETE FILES!!!\nContinuing in 5 seconds");

    let number = 4;

    timerInterval = setInterval(() => {
      console.log(`Continuing in ${number} seconds`);
      number--;
    }, 1000);
  }

  return new Promise<void>((resolve) => {
    setTimeout(
      async () => {
        clearInterval(timerInterval);

        let folderNameSplit = file.split(".");
        folderNameSplit.pop();

        const folderName = folderNameSplit.join(".");

        if (!fs.existsSync(folderName)) {
          throw new Error("Folder does not exist! Please run a conversion first.");
        }

        const originalPath = path.join(folderName, "original.mp4");

        if (!file.endsWith(".mp4")) {
          return await new Promise<void>((resolve) => {
            console.log("Converting container to mp4");
            ffmpeg(file)
              .videoCodec("copy")
              .audioCodec("copy")
              .output(originalPath)
              .on("start", (command) => {
                console.log(command);
              })
              .on("progress", (progress) => {
                console.log(progress);
              })
              .on("end", () => {
                console.log("Finished converting container");
                resolve();
              })
              .run();
          });
        }

        console.log(`Moving ${file} to ${originalPath}`);
        fs.renameSync(file, originalPath);

        if (thumbnail) {
          console.log(`Deleting ${thumbnail}`);
        }
        resolve();
      },
      disableCountdown ? 0 : 5000
    );
  });
};

export default removeOriginalFiles;
