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

    static async find (email) {
        let conn = await client.connect('mongodb://localhost:27017/mongo-test',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = await conn.db('mongo-test');
        return await db.collection('users').find({email : email}).toArray();
    }
    
    static async save (user) {
        let conn = await client.connect('mongodb://localhost:27017/mongo-test',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = await conn.db('mongo-test');
        return await db.collection('users').insertOne(user);
    }
}

module.exports = User;