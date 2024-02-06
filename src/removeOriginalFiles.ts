import fs from "fs";
import path from "path";

const removeOriginalFiles = (file: string, thumbnail?: string) => {
  console.log(
    "THIS COMMAND IS DESTRUCTIVE AND WILL DELETE FILES!!!\nContinuing in 5 seconds",
  );

  let number = 4;

  const timerInterval = setInterval(() => {
    console.log(`Continuing in ${number} seconds`);
    number--;
  }, 1000);

  setTimeout(() => {
    clearInterval(timerInterval);

    let folderNameSplit = file.split(".");
    folderNameSplit.pop();

    const folderName = folderNameSplit.join(".");

    if (!fs.existsSync(folderName)) {
      throw new Error("Folder does not exist! Please run a conversion first.");
    }

    const originalPath = path.join(folderName, "original.mp4");
    console.log(`Moving ${file} to ${originalPath}`);
    fs.renameSync(file, originalPath);

    if (thumbnail) {
      console.log(`Deleting ${thumbnail}`);
    }
  }, 5000);
};

export default removeOriginalFiles;
