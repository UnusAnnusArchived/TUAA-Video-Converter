declare module "get-video-dimensions" {
  export default function (filename: string): Promise<{
    width: number;
    height: number;
  }>;
}
