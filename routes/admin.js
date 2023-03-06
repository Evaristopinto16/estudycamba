const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categorias")
const Categoria = mongoose.model('categorias')
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")


router.get('/oportunidades', (req, res)=>{
    res.render("pagina/biblioteca")
})
router.post('/categoria/edit',eAdmin, (req, res,)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Material editado com sucesso")
            res.redirect("/admin/categoria")
        }).catch((err)=>{
            feq.flash("error_msg", "Houve um erro ao salvar"+ err)
            res.redirect("/admin/categoria")
        })
    }).catch((err)=>{
        req.flash("error_msg", "houve um erro ao salvar a categoria"+err)
        res.redirect("/admin/categoria")
        })
     
})

router.post('/postagem/edit', eAdmin,(req, res)=>{
Postagem.findOne({_id: req.body.id}).then((postagem)=>{
    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo

    postagem.save().then(()=>{
        req.flash("success_msg", "postagem editada com exito")
        res.redirect("/admin/postagem")
    }).catch((err)=>{
        req.flash("houve um erro ao editar a postagem")
        res.redirect("/admin/postagem")
    })
})
})

//routas de editar e remover
router.post('/postagem/rem/',eAdmin, (req, res)=>{
    Postagem.remove({_id: req.body.id}).then(()=>{
        req.flash("postagem eliminada com exito")
        res.redirect('/admin/postagem')
    })
})
router.post('/categoria/rem',eAdmin, (req, res,)=>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "sucesso")
        res.redirect("/admin/categoria")
     })
}) 
    
    router.get('/categoria/edit/:id',eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        res.render("pagina/editcategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "esta material não exite")
        res.redirect("/admin/categoria")
    })
   
  
})
router.get('/postagem/edit/:id', eAdmin,(req, res)=>{
     
    Postagem.findOne({_id: req.params.id}).lean().populate("categoria").then((postagem)=>{

        res.render("pagina/editarpostagem", {postagem: postagem})
        }).catch((err)=>{
        req.flash("error_msg", "esta postagem não exite")
        res.redirect("/admin/postagens")
    })
})

//termino do bloco de editar remover as routas 

router.get('/categoria',eAdmin, (req, res)=>{
    Categoria.find((err, categoria)=>{
        res.render("pagina/categorias", {categoria: categoria})
    }).sort({date: 'desc'})
    .lean()
        
     
    
})

router.get('/categoria/add', eAdmin,(req, res)=>{
    res.render("pagina/addcategorias");
})
router.post('/categorias/nova',eAdmin, (req, res)=>{

    var erros = []

    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null)
    {
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "disciplina inválida"})

    }
    if(req.body.nome.length < 2){
        erros.push({texto: "nome curso"})
    }
    if(erros.length > 0){
        res.render("pagina/addcategorias", {erros: erros})

    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        
    new Categoria(novaCategoria).save().then(()=>{
        req.flash("success_msg", "Categoria criado com sucesso")

        res.redirect('/admin/categoria')

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao salvar a categorias")
         res.redirect("/admin/categoria")
    })
    }
   
 })


 router.get("/postagem",eAdmin,(req, res)=>{

    Postagem.find().lean().populate("categoria").sort("desc").then((postagens)=>{
        res.render("pagina/postagens", {postagens: postagens})


    }) 


 })


 router.get("/postagem/add",eAdmin,(req, res)=>{
    Categoria.find().lean().then((categoria)=>{
        res.render("pagina/addpostagens", {categorias: categoria})
    })
    

 })



 router.post("/postagens/nova",eAdmin, (req, res)=>{

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({text: "Materia Invalida!"})
    }
    if(erros.length > 0){
        res.render("pagina/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            slug: req.body.slug,
            conteudo: req.body.conteudo

        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagem")
        }).catch((erro)=>{
            req.flash("error_msg", "houve um erro ao carregar a postagem")
            res.redirect("/admin/postagem")
        })




    }

   

 })
  
module.exports = router