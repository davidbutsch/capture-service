import { Logger } from "@/libs";
import { app } from ".";
import { config } from "@/common";
import http from "http";

export const httpServer: http.Server = new http.Server(app);

httpServer.listen(config.port, () => {
  Logger.info(`HTTP server listening on port ${config.port}`);
});
