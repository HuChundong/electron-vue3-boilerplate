import { paths, bins } from "ffmpeg-static-electron-forge";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

let ffmpegPath: string;
// , ffprobePath: string;

if(process.env.NODE_ENV !== "development"){
  ffmpegPath = paths.ffmpegPath.replace("app.asar", "app.asar.unpacked");
  // ffprobePath = paths.ffprobePath.replace("app.asar", "app.asar.unpacked");
}else{
  let ffmpegBinPaths = path.dirname(
    require.resolve("ffmpeg-static-electron-forge")
  );
  ffmpegBinPaths = path.resolve(process.cwd(), ffmpegBinPaths, "bin");
  ffmpegPath = path.join(ffmpegBinPaths, bins.ffmpegPath);
  // ffprobePath = path.join(ffmpegBinPaths, bins.ffprobePath);
}

ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);
export default ffmpeg;