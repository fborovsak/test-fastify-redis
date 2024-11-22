import { FastifyInstance } from "fastify"

type TRegisterPostBody = {
    fullname:string
    email: string
    password: string
}

type TLoginPostBody = {
    email: string
    password: string
}

export default function rutas(fastify: FastifyInstance) {
    fastify.get("/", (req, res) => {
        res.view("root.pug")
    })

    fastify.get("/register", (req, res) => {
        res.view("register.pug", {titulo: "Registro de usuarios"})
    })

    fastify.post("/register", (req, res) => {
        const body = req.body as Partial<TRegisterPostBody>
        res.redirect("/registerDone")
    })

    fastify.get("/registerDone", (req,res) => {
        res.view("thankyou.pug", {titulo: "Registro completado"})
    })

    fastify.get("/login", (req, res) => {
        res.view("login.pug", {titulo: "Login de usuarios registrados"})
    })

    fastify.post("/login", (req, res) => {
        const body = req.body as Partial<TLoginPostBody>
        res.redirect("/user")
    })

    fastify.get("/user", (req, res) => {
        res.view("user.pug", {titulo: "Centro de usuarios"})
    })
}