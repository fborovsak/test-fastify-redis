import { createEnv } from "neon-env"
import 'dotenv/config'


const tenv = createEnv({
  HTTP_PORT: { type: "number", default: 56129 },
  REDIS_PORT: { type: "number", default: 6379 },
  COOKIES_MAXAGE: { type: "number", default: 1 },
  SESSION_LIFETIME: { type: "number", default: 1 },
  SESSION_SECRET: {
    type: "string",
    default: "a secret with minimum length of 32 characters",
  },
  HASH_SECRET: { type: "string", default: "a secret hash secret" },
})

export default tenv
