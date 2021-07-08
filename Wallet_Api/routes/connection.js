const mongo = require('mongodb').MongoClient;

const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";

const database = "wallet_api"

let db ;

// Connection With MongoDB
module.exports = () => mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error,client) => {
    if(error){
        throw error;
    }        
    db = client.db(database);
    console.log("connection done")
    return db
})
