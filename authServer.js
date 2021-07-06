require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

let refreshTokens = [];

app.use(express.json());

const port = process.env.PORT || 4000;

app.post('/api/token',(req,res,next) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401);
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user) =>{
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(user);
        res.json({ "accessToken": accessToken});
    })
})

app.delete('/api/logout',(req,res,next) => {
    refreshToken = refreshTokens.filter(token => token != req.body.token);
    res.sendStatus(403);
})
app.post('/api/login', (req, res) => {
    // Authenticate User

    const username = req.body.username;
    const user = { name: username };


    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    // refreshTokens.push(refreshToken)
    res.json({"Token":accessToken});
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10m'});
}

app.listen(port);