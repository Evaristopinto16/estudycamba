const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Professor =  new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    }
})

mongoose.model("professores", Professor)