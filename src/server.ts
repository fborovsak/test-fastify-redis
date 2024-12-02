import Fastify from "fastify"
import rutas from "./rutas"
import fastifyView from "@fastify/view"
import pug from "pug"
import fastifyFormbody from "@fastify/formbody"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"

export default function createServer() {
  const fastify = Fastify({
    logger: true,
  })
  fastify.register(fastifyCookie)
  fastify.register(fastifySession, {
    secret:
      process.env.SESSION_SECRET ||
      "a secret with minimum length of 32 characters",
    cookieName: "sessionId",
    cookie: {
      maxAge: Number(process.env.COOKIES_MAXAGE || 1) * 60 * 1000,
      secure: false,
    },
  })

  fastify.register(fastifyFormbody)

  fastify.register(fastifyView, {
    engine: {
      pug,
    },
    templates: "./src/views",
  })

  fastify.register(rutas)
  return fastify
}
