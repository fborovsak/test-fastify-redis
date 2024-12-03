import dayjs from "dayjs"
import { TUserData } from "./tipos"
import crypto from "crypto"
import tenv from "./env-vars"

const users:TUserData[] = []

export function chequearNuevoUsuario(email:string) {
  if (users.some(u => u.email === email))
    throw "El email ya se encuentra registrado"
}

export function agregarNuevoUsuario(email:string, fullname: string, password: string) {
  users.push({
    email,
    fullname,
    loggedIn: false,
    dateExpireSession: undefined,
    passwordHash: doHash(password)
  })
}


function doHash(str: string) {
  const hash = crypto.createHash('sha256').update(str).digest("hex")
  return hash
}

export function checkUserEmailPass(email: string, password: string) {
  const hash = doHash(password)
  const user = users.find(u => u.email === email && u.passwordHash === hash)
  if (!user) {
    throw "El email o el password son incorrectos"
  }
  return user
}

export function loginUser(user: TUserData) {
  const idx = users.findIndex(u => u.email === user.email)
  user.loggedIn = true
  user.dateExpireSession = dayjs().add(tenv.SESSION_LIFETIME).toDate()
  users[idx] = user
}