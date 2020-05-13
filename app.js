const express =     require('express');
const body_parser = require('body-parser');
const handlebars =  require('express-handlebars');
const admin = require('./routes/admin')
const path = require ("path")
const mongoose = require("mongoose")
app = express();

// Configurações
    //Body-parser
        app.use(body_parser.urlencoded({extended: true}))
        app.use(body_parser.json())
    //Handlebars
        app.engine('handlebars', handlebars({defaultlayout: 'main'}))
        app.set('view engine', 'handlebars');
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() =>{
            console.log("Conexão com o banco de dados realizada")
        }).catch((err) => {
            console.log("Sem conexão com a base de dados: "+ err )
        })
    //Public
    app.use(express.static(path.join(__dirname,"public")))

    app.use((req,res,next) => {
        console.log("OI EU SOU O MIDDLEWARE")
        next();
    })
    
    // Rotas
    app.use('/admin', admin)


// Outros

const PORT = 3352
app.listen(PORT,() =>{
    console.log("Servidor iniciado com sucesso!")
})