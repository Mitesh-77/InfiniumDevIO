const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const database = "wallet_api"
let db, collection_data, merge_data;

// Connection With MongoDB
mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        throw error;
    }
    db = client.db(database);
    collection_data = db.collection("bank");
    db.collection("bank").aggregate([
        {
            $lookup:
            {
                from: 'users',
                localField: 'uid',
                foreignField: 'uid',
                as: 'userdetails'
            }
        }
    ]).toArray(function (err, res) {
        if (err) throw err
        merge_data = res
    })
});

// Check  Api Is Working
router.get('/api/bank', (req, res) => {
    res.send('Bank Api working');
});

// get Function to Read all Data From The Database
router.get("/api/bank/read", function (req, res, next) {
    res.json(merge_data)
});

// Post Function to Update  Data From The Database
router.post("/api/bank/update", function (req, res, next) {
    let data = {
        uid: req.body.uid,
        wallet_amount: req.body.w_amount
    };

    let uid = req.body.uid;
    collection_data.updateOne({ "uid": uid }, { $set: data }, function (err, result) {
        if (err) throw err;
        res.end("Updated Successfuly");
    });
});

// Post Function to Delete  Data From The Database
router.post("/api/bank/delete", function (req, res, next) {
    let uid = req.body.uid;
    collection_data.deleteOne({ "uid": uid }, function (err, result) {
        if (err) throw err;
        res.end("deleted Successfuly");
    });
});

// get Function to Insert Data into  The Database
router.post("/api/bank/create", function (req, res, next) {
    let data = {
        uid: req.body.uid,
        wallet_amount: req.body.w_amount
    };
    collection_data.insertOne(data, function (err, result) {
        if (err) throw err;
        res.end("Inserted Successfuly");
    });
});


module.exports = router;