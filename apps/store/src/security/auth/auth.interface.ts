export interface JwtSign {
  access_token?: string
  refresh_token?: string
  token?: string
  expires?: number
}

export interface JwtPayload {
  sub: string
  username: string
  role: string[]
}

export interface Payload {
  id: string
  username: string
  role: string[]
}
