import Fastify from "fastify"
import rutas from "./rutas"

export default function createServer() {
    const fastify = Fastify({
        logger: true
    })
    fastify.register(rutas)
    return fastify
}