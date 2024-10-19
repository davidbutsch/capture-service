import { env } from "@/common";

export const logFileTransportConfig = {
  combined: {
    filename: `${env.LOG_PATH}/${env.NODE_ENV}/combined.${env.NODE_ENV}.log`,
    level: "verbose",
  },
  error: {
    filename: `${env.LOG_PATH}/${env.NODE_ENV}/error.${env.NODE_ENV}.log`,
    level: "error",
    handleExceptions: false,
    handleRejections: false,
  },
};
