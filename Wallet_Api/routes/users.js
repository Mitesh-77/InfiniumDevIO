const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;

const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const database = "wallet_api"
let db, collection_data,collection_data_bank,collection_data_wallet,merge_data;

// Connection With MongoDB
mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        throw error;
    }
    db = client.db(database);
    collection_data = db.collection("users");
    collection_data_wallet = db.collection("wallet");
    collection_data_bank = db.collection("bank")
    db.collection("users").aggregate([
        {
            $lookup:
            {
                from: 'bank',
                localField: 'uid',
                foreignField: 'uid',
                as: 'bankdetails'
            }
        }
    ]).toArray(function(err,result){
        if(err) throw err
        merge_data =  result
    })

});

// Check  Api Is Working
router.get('/api/user', (req, res) => {
    res.send('User Api working');
});

// get Function to Read all Data From The Database
router.get("/api/user/read", function (req, res, next) {
    res.json(merge_data)
});

// Post Function to Delete  Data From The Database
router.post("/api/user/delete", function (req, res, next) {
    let uid = req.body.uid;
    collection_data.deleteOne({ "uid": uid }, function (err, result) {
        if (err) throw err;
        collection_data_wallet.deleteOne({ "_id": uid })
        collection_data_bank.deleteOne({ "uid": uid })
        res.end("deleted Successfuly");
    });
});

// get Function to Insert Data into  The Database
router.post("/api/user/create", function (req, res, next) {
    let data = {
        uid: req.body.uid,
        name: req.body.name
    };
    collection_data.insertOne(data, function (err, result) {
        if (err) throw err;
        res.end("Inserted Successfuly");
    });
});

// Post Function to Update  Data From The Database
router.post("/api/user/update", function (req, res, next) {
    let data = {
        uid: req.body.uid,
        name: req.body.name
    };
    let uid = req.body.uid;
    collection_data.updateOne({ "uid": uid }, { $set: data }, function (err, result) {
        if (err) throw err;
        res.end("Updated Successfuly");
    });
});



module.exports = router;