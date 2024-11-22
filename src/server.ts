import Fastify from "fastify"
import rutas from "./rutas"
import fastifyView from "@fastify/view"
import pug from "pug"


export default function createServer() {
    const fastify = Fastify({
        logger: true
    })

    fastify.register(fastifyView, {
        engine: {
          pug
        },
        templates: "./src/views"
      })
      


    fastify.register(rutas)
    return fastify
}