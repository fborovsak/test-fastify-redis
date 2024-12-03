import { TLoginPostBody, TRegisterPostBody } from "./tipos"
import { chequearNuevoUsuario } from "./usuarios"

export function validarRegistro(body: Partial<TRegisterPostBody>) {
  if (!body.email)
    throw "El email es obligatorio"
  if (!body.fullname)
    throw "El nombre completo es obligatorio"
  if (!body.password)
    throw "Es obligatorio proveer una contraseña"
  chequearNuevoUsuario(body.email)
}

export function validarLoginUsuario(body: Partial<TLoginPostBody>) {
  if (!body.email)
    throw "El email es obligatorio"
  if (!body.password)
    throw "Es obligatorio proveer una contraseña"
}