const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req, res) => {
    res.render("admin/index")
})


router.get('/posts', (req, res) => {
    res.send("Pagina de Posts")
})


router.get('/categorias', (req, res)  => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})


router.post("/categorias/nova", (req, res) =>{

    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome == ''){
        erros.push({texto: "Nome Invalido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug == ''){
        erros.push({texto: "Slug invalido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria com nome muito pequeno"})
    }

    if(erros.length > 0){
       res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() =>{
            req.flash("success_msg", "Categoria salva com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) =>{
            req.flash("error_msg", "Erro ao salvar categoria, tente novamente")
            res.redirect("/admin")
        })

    }


})

module.exports = router;