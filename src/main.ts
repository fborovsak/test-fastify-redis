import tenv from "./env-vars"
import createServer from "./server"
import dotEnv from "dotenv"

dotEnv.config()

createServer()
  .listen({ port: tenv.HTTP_PORT })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
