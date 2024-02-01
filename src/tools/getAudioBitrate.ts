import { ffprobe } from "fluent-ffmpeg";

const getAudioBitrate = (file: string) => {
  return new Promise<number>((resolve, reject) => {
    ffprobe(file, (err, metadata) => {
      if (err) return reject(err);

      const audioStream = metadata.streams.find(
        (stream) => stream.codec_type === "audio",
      );

      if (audioStream) {
        if (audioStream.bit_rate) {
          resolve(audioStream.bit_rate as any as number); // Types are incorrect; actually outputs a number
        } else {
          reject(new Error("Invalid bit rate found!"));
        }
      } else {
        reject(new Error("No audio stream found!"));
      }
    });
  });
};

export default getAudioBitrate;
