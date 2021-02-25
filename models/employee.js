let mongoose = require('mongoose');

//Employee Schema
let employeeSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    cell:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }

});

let Employee = module.exports = mongoose.model('Employee',employeeSchema);