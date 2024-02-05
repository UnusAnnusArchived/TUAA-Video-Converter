import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import convert from "./convert";
import createSeekImages, { createSeekMetadata } from "./seekImages";
import convertThumbnail from "./thumbnail";

yargs(hideBin(process.argv))
  .command(
    "run [file]",
    "Starts the entire process of converting for the specified file.",
    (yargs) => {
      return yargs
        .positional("file", {
          describe: "The file to convert",
          type: "string",
          demandOption: true,
        })
        .option("root-url", {
          type: "string",
          description: "The root url where the files will be hosted.",
          demandOption: true,
        })
        .option("thumbnail-path", {
          describe: "A thumbnail to convert",
          type: "string",
        })
        .option("rate", {
          alias: "r",
          type: "number",
          description:
            "Set the rate of creating seek images. 4 means every 4 seconds, 5 means every 5 seconds, etc...",
          default: 4,
        });
    },
    async (argv) => {
      const folderName = await convert(argv.file);
      const seekFolder = await createSeekImages(argv.file, argv.rate);
      createSeekMetadata(seekFolder, argv.rate, argv.rootUrl);
      if (argv.thumbnailPath) {
        convertThumbnail(argv.thumbnailPath, folderName);
      }
    },
  )
  .command(
    "create-seek-images [file]",
    "Creates seek images for the specified file",
    (yargs) => {
      return yargs
        .positional("file", {
          type: "string",
          describe: "The file to create seek images of",
          demandOption: true,
        })
        .option("rate", {
          alias: "r",
          type: "number",
          description:
            "Set the rate of creating seek images. 4 means every 4 seconds, 5 means every 5 seconds, etc...",
          default: 4,
        });
    },
    async (argv) => {
      await createSeekImages(argv.file, argv.rate);
    },
  )
  .command(
    "create-seek-metadata [folder]",
    "Creates metadata from a folder with seek images",
    (yargs) => {
      return yargs
        .positional("folder", {
          type: "string",
          describe: "The folder that contains the seek images",
          demandOption: true,
        })
        .option("root-url", {
          type: "string",
          description: "The root url where the files will be hosted.",
          demandOption: true,
        })
        .option("rate", {
          alias: "r",
          type: "number",
          description:
            "Set the rate of creating seek images. 4 means every 4 seconds, 5 means every 5 seconds, etc...",
          default: 4,
        });
    },
    (argv) => {
      createSeekMetadata(argv.folder, argv.rate, argv.rootUrl);
    },
  )
  .command(
    "convert-thumbnail [thumbnail-path] [output-dir]",
    "Converts a thumbnail to webp and places it in the output directory with the correct filename.",
    (yargs) => {
      return yargs
        .positional("thumbnail-path", {
          type: "string",
          describe: "The thumbnail to convert",
          demandOption: true,
        })
        .positional("output-dir", {
          type: "string",
          describe: "The directory to place the output file",
          demandOption: true,
        });
    },
    async (argv) => {
      await convertThumbnail(argv.thumbnailPath, argv.outputDir);
    },
  )
  .parse();
