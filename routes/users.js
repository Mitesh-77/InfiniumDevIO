const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const checkAuth = require("../middleware/check-auth");
const upload = require("express-fileupload");

router.use(upload())

const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const database = "myFirstDB"
let db, collection_data;

mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        throw error;
    }
    db = client.db(database);
    collection_data = db.collection("users");
});

router.get('/api', (req, res) => {
    res.send('Api working');
});


router.get("/api/read", checkAuth, (req, res) => {
    // let query = { name: "Mitesh" }
    // sort({ age: 1 }).limit(2).skip(1).
    const limit = parseInt(req.query.limit)
    collection_data.find({}).toArray(async function(err,result){
        if (err) throw err;
        const page = parseInt(req.query.page);

        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;

        const endIndex = page * limit;
        results = {}
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        // console.log(model)

        if (endIndex < result.length) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }
        
        try { 
            results.result = await collection_data.find().skip(startIndex).limit(limit).toArray()
            res.send(results)
            
        } catch (error) {
            res.json(error)
        }
    })
});

router.post("/api/update", checkAuth, function (req, res, next) {
    let data = {
        name: req.body.name,
        mobileno: req.body.mobileno,
        age: req.body.age
    };

    let id = req.body.id;
    collection_data.updateOne({ "_id": objectId(id) }, { $set: data }, function (err, result) {
        if (err) throw err;
        res.end("Updated Successfuly");
    });
});

router.post("/api/delete", checkAuth, function (req, res, next) {
    let id = req.body.id;
    collection_data.deleteOne({ "_id": objectId(id) }, function (err, result) {
        if (err) throw err;
        res.end("deleted Successfuly");
    });
});

router.post("/api/create", checkAuth, function (req, res, next) {
    let file = req.files.file
    let filename = file.name
    if (req.files) {
        file.mv("./uploads/" + filename, function (err) {
            if (err) throw err
        })
    }
    let data = {
        name: req.body.name,
        mobileno: req.body.mobileno,
        age: req.body.age,
        photo: `${filename}`
    };
    collection_data.insertOne(data, function (err, result) {
        if (err) throw err;
        res.end("Inserted Successfuly");
    });
});

function pagination(model) {

    return (req, res, next) => {
        console.log(res)
        
   
    }
}

module.exports = router;