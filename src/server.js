//npm - node package maneger
const express = require("express")
const server = express()

//Pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta publica style, assets, scripts
server.use(express.static("public"))

//Habilitar o uso do req.body
server.use(express.urlencoded({ extended: true }))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação

//pagina inicial
//req: Requisição, Pedido
//res: Resposta
server.get("/", (req, res) => {
    //pegar e enviar um dado, no caso a file index.html
    return res.render("index.html", { title: "Seu marketplace de coleta de resíduos" })
})



server.get("/create-point", (req, res) => {

    //req.query: Query strings da nossa url 
    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: o corpo do nosso formulário
    //console.log(req.body)

    //inserir dados no banco de dados

       //inserir dados na tabela
    const query = `
        INSERT INTO places (
            image, 
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);        
    `

    const values =  [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Eroo no cadastro!")
            
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values , afterInsertData)

})


server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "" ){
        //Pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }

    //pegar os dados do banco de daods
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length


        //Mostrar a pagina HTML com os dados do BD
        return res.render("search-results.html", { places: rows, total: total })
    })

})

//ligar o servidor abrindo a porta 3000
server.listen(3000)