import { FastifyInstance } from "fastify"

export default function rutas(fastify: FastifyInstance) {
    fastify.get("/", (req, res) => {
        res.send("Hola mundo!!")
    })
}