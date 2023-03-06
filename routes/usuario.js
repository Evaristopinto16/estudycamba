
const express = require("express")
const router = express.Router();
const mongoose = require("mongoose")
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req, res)=>{
  res.render("usuarios/registro")
})
router.post("/registro", (req, res)=>{
    var erros = []
    
    if(!req.body.nome|| typeof req.body.nome== undefined|| req.body.nome == null){
        erros.push({texto: "campo de nome vazio"})

    }
    if(!req.body.email|| typeof req.body.email == undefined|| req.body.email == null){
        erros.push({texto: "campo de email vazio"})

    }
    if(!req.body.nome|| typeof req.body.nome == undefined|| req.body.nome == null){
        erros.push({texto: "campo de senha vazia"})

    }
    if(req.body.senha.length == 4 ){
            erros.push({texto: "insira uma senha com mais de 8 digito"})
 }
    if(req.body.senha2 != req.body.senha){
        erros.push({texto: "Senhas diferentes"})
    }

    
    
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{


        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "já há uma conta com esse E-mail")
                res.redirect("/usuario/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: req.body.adm
                
                })

                bcrypt.genSalt(10, (erro, salt)=>{
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if(erro){
                    req.flash("error_msg", "houve um erro ao salvar o usuario")
                    res.redirect("usuario/registro")
                }
                novoUsuario.senha = hash
                novoUsuario.save().then(()=>{
                    req.flash("success_msg", "Criado com sucesso")
                    res.redirect("/")
                }).catch((err)=>{
                    req.flash("error_msg", "houve um erro ao criar usuario")
                    res.redirect("usuario/registro")
                })
                 
            })
         })  }




        }).catch((err)=>{
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/usuario/registro")
        })
        
    }



})

router.get("/login", (req, res)=>{
    res.render("usuarios/login") 

})

router.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: "/", 
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
})


router.get("/logout", (req, res)=>{
    req.logout(()=>{
        req.flash('success_msg', "logout com sucesso")
    res.redirect("/")
    })
    
})


module.exports = router