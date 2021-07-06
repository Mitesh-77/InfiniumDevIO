require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization; //--> Bearer Token
    const token = authHeader && authHeader.split(' ')[1]; //-->for Token'
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({"message": "kya krte ho sahi se kro.."});
        req.user = user;
        next()
    })
}