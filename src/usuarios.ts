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
