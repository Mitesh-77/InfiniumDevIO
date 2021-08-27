const mongo = require('mongodb').MongoClient;
const url = "mongodb+srv://user:User@123@cluster0.m1fvc.mongodb.net/Data";
const card_database = "card"
let card_db
const valid = require("card-validator");



// Connection With MongoDB
mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (error, client) => {
    if (error) {
        throw error;
    }
    card_db = client.db(card_database)
    collection_card = card_db.collection("users")

});

// Check for Null values
module.exports.check_null = function (req, res, next) {
    let body = Object.values(req.body)
    let check = hasEmptyElement(body)
    if (check == true) {
        res.send("Contains Null Values")
    }
    next()
}

// Check for card number length
module.exports.check_card_number_length = (req, res, next) => {
    let card_number = req.body.card_number
    if (`${card_number}`.length <= 16) {
        const numberValidation = valid.number(card_number);

        if (!numberValidation.isPotentiallyValid) {
            res.status(201).send("Invalid card number")
        }
        console.log(numberValidation.card)
        if (numberValidation.card) {
            res.cardType = numberValidation.card.type
            next()
        }
    } else {
        res.status(201).send(`Enter Valid Card Length `)
    }
}


// function IsValidCreditCardNumber(cardNumber) {

//     let cardType = null;
//     if (VisaCardnumber(cardNumber)) {
//         cardType = "visa";
//     } else if (MasterCardnumber(cardNumber)) {
//         cardType = "mastercard";
//     } else if (AmexCardnumber(cardNumber)) {
//         cardType = "americanexpress";
//     } else if (DiscoverCardnumber(cardNumber)) {
//         cardType = "discover";
//     } else if (DinerClubCardnumber(cardNumber)) {
//         cardType = "dinerclub";
//     } else if (JCBCardnumber(cardNumber)) {
//         cardType = "jcb";
//     } else {
//         cardType = undefined
//     }
//     return cardType;
// }

// function AmexCardnumber(inputtxt) {
//     const cardno = /^(?:3[47][0-9]{13})$/;
//     return cardno.test(inputtxt);
// }

// function VisaCardnumber(inputtxt) {
//     const cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
//     return cardno.test(inputtxt);
// }

// function MasterCardnumber(inputtxt) {
//     const cardno = /^(?:5[1-5][0-9]{14})$/;
//     return cardno.test(inputtxt);
// }

// function DiscoverCardnumber(inputtxt) {
//     const cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
//     return cardno.test(inputtxt);
// }

// function DinerClubCardnumber(inputtxt) {
//     const cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
//     return cardno.test(inputtxt);
// }

// function JCBCardnumber(inputtxt) {
//     const cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
//     return cardno.test(inputtxt);
// }


function hasEmptyElement(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] == 'undefined' || arr[i] == null || arr[i] == " " || arr[i].length < 0) {
            return true;
        }
    }
    return false;
}