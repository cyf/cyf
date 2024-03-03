import CryptoJS from "crypto-js";
import { mapValues } from "lodash";

const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
const ENCRYPT_IV = process.env.ENCRYPT_IV;

const key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(ENCRYPT_IV);

const _encryptDefUrls = [
  "/api/backend/auth/login",
  "/api/backend/auth/register",
];
const _encryptKeys = ["password", "newPassword", "oldPassword"];

export const encrypt = (text: string) => {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  return encrypted.toString();
};

export const decrypt = (encrypted: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptSensitiveInfo = (
  url: string,
  data: Record<string, any>,
) => {
  if (_encryptDefUrls.includes(url)) {
    return mapValues(data, (value, key) => {
      return _encryptKeys.includes(key) ? encrypt(value) : value;
    });
  }
  return data;
};
