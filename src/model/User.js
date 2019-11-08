let client = require('mongodb').MongoClient;

class User{

    constructor(data){
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this.cep = data.cep;
        this.rua = data.rua;
        this.bairro = data.bairro;
        this.numero = data.numero;
        this.complemento = data.complemento;
    }

    static async find (email,collection) {
        let conn = await client.connect('mongodb+srv://admin:1234@cluster0-tql9j.mongodb.net/projeto2-overleaf?retryWrites=true&w=majority',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = conn.db();
        return await db.collection(collection).find({email : email}).toArray();
    }
    
    static async save (user) {
        let conn = await client.connect('mongodb+srv://admin:1234@cluster0-tql9j.mongodb.net/projeto2-overleaf?retryWrites=true&w=majority',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = conn.db();
        return await db.collection('users').insertOne(user);
    }
}

module.exports = User;