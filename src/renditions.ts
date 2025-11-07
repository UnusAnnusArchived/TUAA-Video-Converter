export interface Rendition {
  width: number;
  height: number;
  profile: string;
  hlsTime: string;
  bv: string;
  maxrate: string;
  bufsize: string;
  ba: string;
  ts_title: string;
  master_title: string;
}

const presetRenditions: { [key: number]: Rendition } = {
  256: {
    width: 256,
    height: 144,
    profile: "main",
    hlsTime: "4",
    bv: "200k",
    maxrate: "250k",
    bufsize: "500k",
    ba: "",
    ts_title: "144p",
    master_title: "144p",
  },
  426: {
    width: 426,
    height: 240,
    profile: "main",
    hlsTime: "4",
    bv: "350k",
    maxrate: "400k",
    bufsize: "800k",
    ba: "",
    ts_title: "240p",
    master_title: "240p",
  },
  640: {
    width: 640,
    height: 360,
    profile: "main",
    hlsTime: "4",
    bv: "350k",
    maxrate: "800k",
    bufsize: "1600k",
    ba: "",
    ts_title: "360p",
    master_title: "360p",
  },
  854: {
    width: 854,
    height: 480,
    profile: "high",
    hlsTime: "4",
    bv: "800k",
    maxrate: "1200k",
    bufsize: "2400k",
    ba: "",
    ts_title: "480p",
    master_title: "480p",
  },
  1280: {
    width: 1280,
    height: 720,
    profile: "high",
    hlsTime: "4",
    bv: "1200k",
    maxrate: "1900k",
    bufsize: "3800k",
    ba: "",
    ts_title: "720p",
    master_title: "720p",
  },
  1920: {
    width: 1920,
    height: 1080,
    profile: "high",
    hlsTime: "4",
    bv: "1900k",
    maxrate: "4500k",
    bufsize: "9000k",
    ba: "",
    ts_title: "1080p",
    master_title: "1080p",
  },
  2560: {
    width: 2560,
    height: 1440,
    profile: "high",
    hlsTime: "4",
    bv: "4500k",
    maxrate: "9000k",
    bufsize: "18000k",
    ba: "",
    ts_title: "1440p",
    master_title: "1440p",
  },
  3840: {
    width: 3840,
    height: 2160,
    profile: "high",
    hlsTime: "4",
    bv: "9000k",
    maxrate: "12000k",
    bufsize: "24000k",
    ba: "",
    ts_title: "2160p",
    master_title: "2160p",
  },
  7680: {
    width: 7680,
    height: 4320,
    profile: "high",
    hlsTime: "4",
    bv: "12000k",
    maxrate: "20000k",
    bufsize: "40000k",
    ba: "",
    ts_title: "2160p",
    master_title: "2160p",
  },
};

export default presetRenditions;
