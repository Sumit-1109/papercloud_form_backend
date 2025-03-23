const mongoose = require("mongoose");
const inputField = require("./inputField.model");

const formModel = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    inputFields : [inputField],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    groupBy : {
        type : String,
        default : "None",
        enum : ["None", "Category", "Input Type"]
    }
})

module.exports = mongoose.model('Form', formModel);