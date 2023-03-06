 

if(process.env.NODE_ENVE== "production"){
    module.exports = {mongoURI: "mongodb+srv://evaristopinto16:Calucang0@cluster0.rxu0enl.mongodb.net/test"}
}else{
    module.exports = {mongoURI: "mongodb://127.0.0.1:27017/cmep"}
}