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
    store:{
        async set(sessionId, session, callback) {
          try {
            const expireDate = session.dateExpireSession || dayjs().add(tenv.SESSION_LIFETIME * 60, 'seconds').toDate()
            await fastify.redis
              .pipeline()
              .hset(sessionId, {
                cookie: JSON.stringify(session.cookie),
                user: JSON.stringify(session.user),
                dateExpireSession: expireDate.toJSON()
              })
              .expire(sessionId, Math.max(expireDate.getTime() - Date.now(), 0))
              .exec(callback)
          } catch (error:any) {
            callback(error)
          }
        },
        async get(sessionId, callback) {
          try {
            const result = await fastify.redis.hgetall(sessionId)
            const user = result['user'] ? JSON.parse(result['user']) : undefined
            const data = {
              cookie: result['cookie'] ? JSON.parse(result['cookie']) : undefined,
              user: user,
              dateExpireSession: result['dateExpireSession'] ? new Date(result['dateExpireSession']) : undefined,
              isAuth: !!user
            }
            callback(undefined, data)
          } catch (error:any) {
            callback(error)
          }
        },
        async destroy(sessionId, callback) {
          try {
            await fastify.redis.del(sessionId)
            callback()
          } catch (error: any) {
            callback(error)
          }
        },
      },
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
