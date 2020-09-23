const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const Pool = require('pg').Pool

// Configurando a template engine nunjucks
nunjucks.configure("./", {
    autoescape: true,
    express: server,
    watch: true,
    noCache: true
})

// Configuração DB PostgreSQL
const db = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'dbdoesangue'
})

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

server.get("/", (req, res) => {
    db.query("SELECT * FROM donors", function(error, result) {
        errorConection()
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(error) {
        errorConection()
        return res.redirect("/")
    })
})

function errorConection(error) {
    if (error)
        return res.send("Erro na conexão com banco de dados")
}

server.listen(3000, () => {
    console.log("Servidor iniciado")
})