import queryString from 'query-string'
import sortKeysRecursive from 'sort-keys-recursive'
import CryptoJS from 'crypto-js'

export const sign = (query: Record<string, any>) => {
  const queryStr = queryString.stringify(sortKeysRecursive(query))
  const utf8Str = CryptoJS.enc.Utf8.parse(
    queryStr + process.env.REQUEST_SIGN_KEY,
  )
  return CryptoJS.enc.Hex.stringify(CryptoJS.MD5(utf8Str))
}
