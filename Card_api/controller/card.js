const mongo = require('mongodb').MongoClient;
const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const card_database = "wallet_api"
let card_db, collection_card

// Connection With MongoDB
mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
    if (error) {
        throw error;
    }
    card_db = client.db(card_database)
    collection_card = card_db.collection("card")

});

// card Api is working
module.exports.card_api = (req, res) => {
    res.send("Card Api is Working..")
}

// Add card to Database
module.exports.add_card = async (req, res) => {
    const id = parseInt(req.params.id)
    const data = {
        _id: id,
    }
    const card_details = {
        card_number: req.body.card_number,
        card_type: res.cardType,
        valid_from: req.body.valid_from,
        valid_upto: req.body.valid_upto,
        Account_holder_name: req.body.Account_holder_name,
        cvv: req.body.cvv
    }
    res.send(card_details)
    const check = await collection_card.find({ _id: id }).toArray()
    if (Object.entries(check).length === 0) {
        await collection_card.insertOne(data, async (err) => {
            if (err) {
                res.send(err.status)
            }
        })
    }

    await collection_card.updateOne({ _id: id }, { $push: { User_card_details: card_details } }, (err) => {
        if (err) {
            res.send(err.status)
        } else {
            res.send("Card Added SuccessFully")
        }
    })
}

// Read all cards of user
module.exports.read_card = async (req, res) => {
    const id = parseInt(req.params.id)
    await collection_card.find({ _id: id }).toArray((err, result) => {
        if (err) {
            res.send(err.status)
        } else {
            res.send(result)
        }
    })
}

// Delete card of user
module.exports.delete_card = async (req, res) => {
    const cnumber = Number(req.params.card_number)
    await collection_card.updateOne({ "User_card_details.card_number": cnumber }, { $pull: { User_card_details: { card_number: cnumber } } }, (err) => {
        if (err) {
            res.send(err.status)
        } else {
            res.send("Card Deleted SuccessFully")
        }
    })
}
