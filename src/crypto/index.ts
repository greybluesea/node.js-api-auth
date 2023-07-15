import crypto from "crypto";

const SECRET = "NODEJS-API";

export const getRandom = () => crypto.randomBytes(128).toString("base64");

export const authenticate = (salt: string, password: string): string => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
