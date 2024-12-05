
export type TRegisterPostBody = {
  fullname: string
  email: string
  password: string
}

export type TLoginPostBody = {
  email: string
  password: string
}

export type TUserData = {
  fullname: string
  email: string
  passwordHash: string
}

export type UserSession= {
  email: string
  fullname: string
}

declare module "fastify" {
  interface Session {
    isAuth: boolean
    user?: UserSession
    dateExpireSession?: Date
  }
}