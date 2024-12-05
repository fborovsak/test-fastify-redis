import Fastify from "fastify"
import rutas from "./rutas"
import fastifyView from "@fastify/view"
import pug from "pug"
import fastifyFormbody from "@fastify/formbody"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import tenv from "./env-vars"
import { TUserData } from "./tipos"

declare module "fastify" {
  interface Session {
    isAuth: boolean
    user?: TUserData
  }
}

export default function createServer() {
  const fastify = Fastify({
    logger: true,
  })
  fastify.register(fastifyCookie)
  fastify.register(fastifySession, {
    secret: tenv.SESSION_SECRET,
    cookieName: "sessionId",
    cookie: {
      maxAge: tenv.COOKIES_MAXAGE * 60 * 1000,
      secure: false,
    },
  })

  fastify.register(fastifyFormbody)

  fastify.addHook("preHandler", async (req, res) => {
    if (req.url !== "/logout") {
      if (req.session.get("isAuth")) {
        const user = req.session.get("user")
        if (user) {
          const tiempo = user.dateExpireSession?.getTime()
          if (tiempo && tiempo < Date.now()) {
            res.redirect("/logout")
            return res
          }
        }
      }
    }
  })

  fastify.register(fastifyView, {
    engine: {
      pug,
    },
    templates: "./src/views",
  })

  fastify.register(rutas)
  return fastify
}
