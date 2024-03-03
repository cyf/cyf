import CryptoJS from 'crypto-js'
import bcrypt from 'bcrypt'

const ENCRYPT_KEY = process.env.ENCRYPT_KEY
const ENCRYPT_IV = process.env.ENCRYPT_IV

const key = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY)
const iv = CryptoJS.enc.Utf8.parse(ENCRYPT_IV)

// 用于数据库中隐私信息加密
export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
    mode: CryptoJS.mode.CTR,
    iv: iv,
  }).toString()
}

// 用于数据库中隐私信息解密
export const decrypt = (encrypted: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key, {
    mode: CryptoJS.mode.CTR,
    iv: iv,
  })
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const hashed = (text: string) => {
  return bcrypt.hashSync(text, 10)
}

export const compare = (text: string, hashed: string) => {
  return bcrypt.compareSync(text, hashed)
}
