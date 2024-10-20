import { path } from "@ffmpeg-installer/ffmpeg";
import Ffmpeg from "fluent-ffmpeg";
export const ffmpeg = Ffmpeg;
ffmpeg.setFfmpegPath(path);
