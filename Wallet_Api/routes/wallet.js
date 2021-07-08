const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const database = "wallet_api"
let db, collection_data_wallet,collection_data_bank,merge_data;

// Connection With MongoDB
mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        throw error;
    }
    db = client.db(database);
    collection_data_wallet = db.collection("wallet");
    collection_data_bank = db.collection("bank");
    db.collection("wallet").aggregate([
        {
            $lookup:
            {
                from: 'bank',
                localField: '_id',
                foreignField: 'uid',
                as: 'userdetails'
            }
        }
    ]).toArray(function(err, res) {
        if (err) throw err
        merge_data = res
    })
});

// Check  Api Is Working
router.get('/api/wallet', (req, res) => {
    res.send('wallet Api working');
});

// get Function to Read all Data From The Database
router.get("/api/wallet/read", function (req, res, next) {
    res.json(merge_data)
});

// Post Function to Update  Data From The Database
router.post("/api/wallet/update", function (req, res, next) {
    let data = {
        _id: req.body.uid,
        wallet_id: req.body.wallet_id,
        wallet_amount: req.body.wallet_amount
    };

    let uid = req.body.uid;
    collection_data_bank.updateOne({ "uid": uid }, { $set: { "wallet_amount": req.body.wallet_amount } });
    collection_data_wallet.updateOne({ "_id": uid }, { $set: data }, function (err, result) {
        if (err) throw err;
        res.end("Updated Successfuly");
    });
});

// Post Function to Delete  Data From The Database
router.post("/api/wallet/delete", function (req, res, next) {
    let uid = req.body.uid;
    collection_data_wallet.deleteOne({ "_id": uid }, function (err, result) {
        if (err) throw err;
        collection_data_bank.deleteOne({ "uid": uid })
        res.end("deleted Successfuly");
    });
});

// get Function to Insert Data into  The Database
router.post("/api/wallet/create", function (req, res, next) {
    let data = {
        uid: req.body.uid,
        wallet_id: req.body.wallet_id,
        wallet_amount: req.body.wallet_amount
    };
    collection_data_bank.insertOne({ "uid": req.body.uid, "wallet_amount": req.body.wallet_amount }, function (err, result) {
        if (err) throw err;
    })
    collection_data_wallet.insertOne(data, function (err, result) {
        if (err) throw err;
        res.end("Inserted Successfuly");
    });
});


module.exports = router;