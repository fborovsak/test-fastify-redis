import dayjs from "dayjs"
import { TUserData } from "./tipos"
import crypto from "crypto"

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
