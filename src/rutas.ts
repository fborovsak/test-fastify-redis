import { FastifyInstance } from "fastify"

export default function rutas(fastify: FastifyInstance) {
    fastify.get("/", (req, res) => {
        res.view("root.pug")
    })
}