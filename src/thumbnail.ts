import ffmpeg from "fluent-ffmpeg";

const convertThumbnail = (thumbnailPath: string, outDir: string) => {
  return new Promise<void>((resolve) => {
    console.log("Converting thumbnail");
    ffmpeg(thumbnailPath)
      .videoFilter("scale=1280x720")
      .output(`${outDir}${outDir.endsWith("/") ? "" : "/"}thumb.webp`)
      .on("start", (command) => {
        console.log(command);
      })
      .on("progress", (progress) => {
        console.log(progress);
      })
      .on("end", () => {
        console.log("Finished converting thumbnail");
        resolve();
      })
      .run();
  });
};

export default convertThumbnail;
