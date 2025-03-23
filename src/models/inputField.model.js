const mongoose = require("mongoose");

const inputField = new mongoose.Schema({
    type : {
        type : String,
        enum: ["TEXT", "NUMBER", "EMAIL", "PASSWORD", "DATE"],
        required: true,
    },
    title : {
        type : String,
        required: true,
    },
    placeholder : {
        type : String,
        default : ""
    },
    order : {
        type : Number,
        required: true,
    },
    category : {
        type : String,
    },
    id : {
        type : String, 
        required : true
    }
})

module.exports = inputField;