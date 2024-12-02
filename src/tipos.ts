
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
  loggedIn: boolean
  dateExpireSession?: Date
}