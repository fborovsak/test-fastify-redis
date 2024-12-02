import { FastifyInstance } from "fastify"
import { TLoginPostBody, TRegisterPostBody, TUserData } from "./tipos"
import { validarRegistro } from "./validaciones"
import { agregarNuevoUsuario } from "./usuarios"

const pugViews = {
  login: "login.pug",
  register: "register.pug",
  root: "root.pug",
  thankyou: "thankyou.png",
  user: "user.png"
}

const users:TUserData[] = []

export default function rutas(fastify: FastifyInstance) {
  fastify.get("/", (req, res) => {
    res.view(pugViews.root)
  })

  fastify.get("/register", (req, res) => {
    res.view(pugViews.register, { titulo: "Registro de usuarios" })
  })

  fastify.post("/register", (req, res) => {
    const body = req.body as Partial<TRegisterPostBody>
    try {
      validarRegistro(body)
      agregarNuevoUsuario(body.email!,body.fullname!,body.password!)
      res.redirect("/registerDone")
    } catch (err:any) {
      const error = err.toString()
      res.status(400).view(pugViews.register, {error, fullName: body.fullname, email: body.email})
    }
  })

  fastify.get("/registerDone", (req, res) => {
    res.view(pugViews.thankyou, { titulo: "Registro completado" })
  })

  fastify.get("/login", (req, res) => {
    res.view(pugViews.login, { titulo: "Login de usuarios registrados" })
  })

  fastify.post("/login", (req, res) => {
    const body = req.body as Partial<TLoginPostBody>
    res.redirect("/user")
  })

  fastify.get("/user", (req, res) => {
    res.view(pugViews.user, { titulo: "Centro de usuarios" })
  })
}
