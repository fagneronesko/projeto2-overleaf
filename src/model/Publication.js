let client = require('mongodb').MongoClient;

class Publication{

    constructor(data){
        this.email = data.email;
        this.text = data.text;
    }

    static async find () {
        let conn = await client.connect('mongodb://localhost:27017/mongo-test',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = await conn.db('mongo-test');
        return await db.collection('publications').find().toArray();
    }
    
    static async save (publication) {
        let conn = await client.connect('mongodb://localhost:27017/mongo-test',
            {useNewUrlParser: true, useUnifiedTopology: true});
        let db = await conn.db('mongo-test');
        return await db.collection('publications').insertOne(publication);
    }
}

module.exports = Publication;