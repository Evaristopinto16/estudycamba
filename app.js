 const db = require("./config/db")
const routers = require('./routes/admin')
const usuario = require("./routes/usuario")
const path = require("path")
const mongoose = require('mongoose');
const express = require('express');
const exphbs = require("express-handlebars");
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categorias")
const Categorias = mongoose.model("categorias")
const passport = require('passport');
require("./config/auth")(passport)
 
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));

const bodyParser = require('body-parser');

 app.set('view engine', 'handlebars');


//configuracões
//sessão
app.use(session({
    secret: "cursodenode",
    resave: true, 
    saveUninitialized: true}
    )
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//mimdlerwere
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
}) 
    //body'parse
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //hand 
 
    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect(db.mongoURI).then(()=>{
        console.log("conectado ao banco de dados remoto")
    }).catch((erro)=>{
        console.log("Erro ao se conectar ao banco de dados"+ erro)
    })
    //em breve
    //public
        app.use(express.static( __dirname, +'/public'))
        

//rotas
app.get('/', (req, res)=>{
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagem)=>{
        res.render("index", {postagens: postagem})
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
   
});
app.get("/postagem/:slug", (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Está postagem não exite")
            res.redirect("/")

        }
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")

    })
})
 
app.use('/admin', routers);
app.use("/usuario/", usuario)
 



app.get("/404", (req, res)=>{
    res.send("erro")
})

app.get("/biblioteca", (req, res)=>{
    res.render("pagina/biblioteca")
})
app.get("/categorias", (req, res)=>{
    Categorias.find().lean().then((categorias)=>{
        res.render("categorias/categorias", {categorias: categorias})
    })
})
app.get("/", (req, res)=>{
    Categorias.find().lean().then((categorias)=>{
        res.render("partials/menu", {categorias: categorias})
    })
})




app.get("/categorias/:slug", (req, res)=>{
    Categorias.findOne({slug: req.params.slug}).lean().then((categoria)=>{
       if(categoria){

         Postagem.find({categoria: categoria._id}).populate("categoria").lean().then((postagens)=>{
                res.render("categorias/postagem", {postagens: postagens})
                
         }).catch((err)=>{
            req.flash("error_msg", "houve um erro ao processar o pedido")
            res.redirect("/")
         })
       }else{
        req.flash("error_msg", "houve um erro ao ver mataria")
        res.redirect("/categorias")
       }
    })
})

    

//outros
const PORT = process.env.PORT ||8089
app.listen(PORT, ()=>{
    console.log("Servidor redando! na porta https://localhost:2000/")
})
