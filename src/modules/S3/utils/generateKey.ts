import crypto from "crypto";

export const generateKey = (prefix?: string) =>
  encodeURIComponent(
    (prefix ? prefix : "") + crypto.randomBytes(64).toString("hex")
  );
