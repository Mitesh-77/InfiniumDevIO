const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: string,
        required : true
    }
})

module.exports = mongoose.model('User',userSchema);