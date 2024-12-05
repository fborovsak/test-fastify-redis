import { SessionStore } from "@fastify/session"
import dayjs from "dayjs"
import { FastifyInstance, Session } from "fastify"
import tenv from "./env-vars"

export default class RedisStore implements SessionStore {
  constructor(private fastify: FastifyInstance) {}

  async set(
    sessionId: string,
    session: Session,
    callback: (err?: any) => void
  ) {
    try {
      const expireDate =
        session.dateExpireSession ||
        dayjs()
          .add(tenv.SESSION_LIFETIME * 60, "seconds")
          .toDate()
      await this.fastify.redis
        .pipeline()
        .hset(sessionId, {
          cookie: JSON.stringify(session.cookie),
          user: JSON.stringify(session.user),
          dateExpireSession: expireDate.toJSON(),
        })
        .expire(sessionId, Math.max(expireDate.getTime() - Date.now(), 0))
        .exec(callback)
    } catch (error: any) {
      callback(error)
    }
  }

  async get(
    sessionId: string,
    callback: (err: any, result?: Session | null) => void
  ) {
    try {
      const result = await this.fastify.redis.hgetall(sessionId)
      const user = result["user"] ? JSON.parse(result["user"]) : undefined
      const data = {
        cookie: result["cookie"] ? JSON.parse(result["cookie"]) : undefined,
        user: user,
        dateExpireSession: result["dateExpireSession"]
          ? new Date(result["dateExpireSession"])
          : undefined,
        isAuth: !!user,
      }
      callback(undefined, data)
    } catch (error: any) {
      callback(error)
    }
  }

  async destroy(sessionId: string, callback: (err?: any) => void) {
    try {
      await this.fastify.redis.del(sessionId)
      callback()
    } catch (error: any) {
      callback(error)
    }
  }
}
