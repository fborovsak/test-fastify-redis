import { FastifyInstance } from "fastify"
import { TLoginPostBody, TRegisterPostBody, TUserData } from "./tipos"
import { validarLoginUsuario, validarRegistro } from "./validaciones"
import {
  agregarNuevoUsuario,
  checkUserEmailPass,
  loginUser,
  logoutUser,
} from "./usuarios"

const pugViews = {
  login: "login",
  register: "register",
  root: "root",
  thankyou: "thankyou",
  user: "user",
}

const privateRouteHook: Partial<Parameters<FastifyInstance["get"]>["1"]> = {
  preParsing: async (req, res) => {
    if (!req.session.get("isAuth")) {
      res.redirect("/")
      return res
    }
  },
}

const publicRouteHook: Partial<Parameters<FastifyInstance["get"]>["1"]> = {
  preParsing: async (req, res) => {
    if (req.session.get("isAuth")) {
      res.redirect("/user")
      return res
    }
  },
}

export default function rutas(fastify: FastifyInstance) {
  fastify.get("/", publicRouteHook, (req, res) => {
    res.view(pugViews.root)
  })

  fastify.get("/register", publicRouteHook, (req, res) => {
    res.view(pugViews.register, { titulo: "Registro de usuarios" })
  })

  fastify.post("/register", publicRouteHook, (req, res) => {
    const body = req.body as Partial<TRegisterPostBody>
    try {
      validarRegistro(body)
      agregarNuevoUsuario(body.email!, body.fullname!, body.password!)
      res.redirect("/registerDone")
    } catch (err: any) {
      const error = err.toString()
      res.status(400).view(pugViews.register, {
        error,
        fullName: body.fullname,
        email: body.email,
        titulo: "Registro de usuarios",
      })
    }
  })

  fastify.get("/registerDone", publicRouteHook, (req, res) => {
    res.view(pugViews.thankyou, { titulo: "Registro completado" })
  })

  fastify.get("/login", publicRouteHook, (req, res) => {
    res.view(pugViews.login, { titulo: "Login de usuarios registrados" })
  })

  fastify.post("/login", publicRouteHook, (req, res) => {
    const body = req.body as Partial<TLoginPostBody>
    try {
      validarLoginUsuario(body)
      const user = checkUserEmailPass(body.email!, body.password!)
      loginUser(user)
      req.session.set("isAuth", true)
      req.session.set("user", user)
      res.redirect("/user")
    } catch (err: any) {
      const error = err.toString()
      res.status(400).view(pugViews.login, {
        error,
        email: body.email,
        titulo: "Login de usuarios registrados",
      })
    }
  })

  fastify.get("/user", privateRouteHook, (req, res) => {
    const user = req.session.get("user")
    const nombreUsuario = user?.fullname || "Anónimo"
    res.view(pugViews.user, { titulo: "Centro de usuarios", nombreUsuario })
  })

  fastify.get("/logout", privateRouteHook, (req, res) => {
    const user = req.session.get("user")
    if (user) {
      logoutUser(user)
    }
    req.session.destroy()
    res.redirect("/")
  })
}
