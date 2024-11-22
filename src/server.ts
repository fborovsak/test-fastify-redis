import Fastify from "fastify"
import rutas from "./rutas"
import fastifyView from "@fastify/view"
import pug from "pug"
import fastifyFormbody from "@fastify/formbody"


export default function createServer() {
    const fastify = Fastify({
        logger: true
    })

    fastify.register(fastifyFormbody)

    fastify.register(fastifyView, {
        engine: {
          pug
        },
        templates: "./src/views"
      })
      


    fastify.register(rutas)
    return fastify
}