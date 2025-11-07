import ffmpeg from "fluent-ffmpeg";

const autoThumbnail = (file: string, outDir: string) => {
  return new Promise<void>((resolve) => {
    console.log("Generating thumbnail");
    ffmpeg(file)
      .videoFilter("scale=1280x720")
      .frames(1)
      .output(`${outDir}${outDir.endsWith("/") ? "" : "/"}thumb.avif`)
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

export default autoThumbnail;
