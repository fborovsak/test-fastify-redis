import Fastify, { Session } from "fastify"
import rutas from "./rutas"
import fastifyView from "@fastify/view"
import pug from "pug"
import fastifyFormbody from "@fastify/formbody"
import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import fastifyRedis from "@fastify/redis"
import tenv from "./env-vars"
import dayjs from "dayjs"
import RedisStore from "./redisStore"

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
    store: new RedisStore(fastify)
  })

  fastify.register(fastifyRedis, {
    host: tenv.REDIS_HOST,
    port: tenv.REDIS_PORT
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
