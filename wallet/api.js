const express = require('express')
const app = express()
const fs = require('fs')
app.use(express.json());

const port = process.env.PORT || 3030;

app.get("/wallet", async function (req, res) {
    let data = fs.readFileSync('db.json')
    let fetch_data = JSON.parse(data)
    res.json(fetch_data)
})

app.post("/wallet", async function (req, res) {
    const uid = req.body.uid;
    const wallet_amount = req.body.wallet_amount
    let data = fs.readFileSync('db.json')
    let fetch_data = JSON.parse(data)
    let data_param ={
                "uid":uid,
                "wallet_amount":wallet_amount
            }
    console.log(typeof(data_param))
})

app.get("/wallet/:uid", function (req, res) {
    const uid = req.params.uid
    let data = fs.readFileSync('db.json')
    let fetch_data = JSON.parse(data)
    const requiredRecord = fetch_data.users.find(record => record.uid == uid)
    res.json(requiredRecord)
})

app.listen(port);