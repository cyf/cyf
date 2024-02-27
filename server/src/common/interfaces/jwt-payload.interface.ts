export interface JwtPayload {
  id: string
  username: string
  nickname?: string
  iat: number
  exp: number
}
