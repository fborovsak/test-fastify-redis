import createServer from "./server"
import dotEnv from "dotenv"

dotEnv.config()

createServer()
  .listen({ port: Number(process.env.HTTP_PORT) || 56129 })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
