import Yargs from "yargs";
import { hideBin } from "yargs/helpers";
import convert from "./convert";
import fs from "fs";

const yargs = Yargs(hideBin(process.argv))
  .command(
    "convert [file]",
    "Starts converting a file to HLS",
    (yargs) => {
      return yargs.positional("file", {
        describe: "The file to convert",
      });
    },
    (argv) => {
      console.log("file:", argv.file);
      convert(argv.file as string);
    },
  )
  .parse();
