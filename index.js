const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Pergunta = require("./database/Pergunta.js")
const Resposta = require("./database/Resposta.js");
const { response } = require("express");
// database
connection
    .authenticate()
    .then(()=>{
    console.log("Conexão feita com sucesso")
    })
    .catch ((msgErro)=>{
        console.log("Error")
    })

// estou dizendo para o express usar o ejs como view engine
app.set('view enfine','ejs');
app.use(express.static('public'));
//bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.get("/",(req,res) => {
    Pergunta.findAll({ raw:true, order:[
        ['id','DESC'] //asc = crescente
    ]}).then(perguntas =>{
        res.render("index.ejs",{
            perguntas: perguntas
        });
    })
    
});

app.get("/perguntar", (req,res) =>{
    res.render("perguntar.ejs");
})

app.post("/salvarpergunta", (req, res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/")
    });
});


app.get("/pergunta/:id",(req, res)=>{
    let id = req.params.id;
    Pergunta.findOne({
        where: {id : id}
    }).then(pergunta =>{
        if( pergunta != undefined){// pergunta achada

            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[['id','desc']]
            }).then(respostas =>{
                res.render("pergunta.ejs",{
                    pergunta: pergunta,
                    respostas: respostas
                })
            });
        }else{
            res.redirect("/")
        }
    } )
})

app.post("/responder",(req,res)=>{
    let corpo = req.body.corpo;
    let perguntaId =req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/" + perguntaId)
    })
})



app.listen(2512,()=>{
    console.log("Rodando")
});

