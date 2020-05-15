const express  = require("express");
const router   = express.Router()
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
    Categoria.find().sort({date: 'desc'}).then((categorias) =>{
        res.render("admin/categorias", {categorias: categorias.map(categoria => categoria.toJSON())})
    }).catch((err) =>{
        req.flash("erro_msg", "houve um erro ao analisar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias", {categoria:categoria})
    }).catch((err)=>{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect('/admin/categorias')
    })
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

router.post("/categorias/edit", (req, res) =>{
const erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == '' || req.body.nome == null || req.body.nome <= 2){
        erros.push({texto: "Nome invalido, insira o nome corretamente!"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || req.body.slug == '' || req.body.slug <= 2){
        erros.push({texto: "Slug invalido"})
    }

    if(erros.length > 0){
        res.render("admin/editcategorias", {erros: erros })
    }else{

        Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        
                
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() =>{
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch(() =>{
                res.flash("error_msg", "Erro ao editar categoria")
                res.redirect("/admin/categorias")
            })
    
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
        
    }


    

})

module.exports = router;