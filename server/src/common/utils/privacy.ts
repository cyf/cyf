import CryptoJS from 'crypto-js'

const ENCRYPT_KEY = process.env.ENCRYPT_KEY
const ENCRYPT_IV = process.env.ENCRYPT_IV

const key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY)
const iv = CryptoJS.enc.Utf8.parse(ENCRYPT_IV)

// 用于请求中隐私信息加密
export const encrypt = (text: string) => {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  })

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  return encrypted.toString()
}

// 用于请求中隐私信息解密
export const decrypt = (encrypted: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
