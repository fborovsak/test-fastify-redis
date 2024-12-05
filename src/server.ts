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
    console.log(req.session.get("isAuth"))
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
