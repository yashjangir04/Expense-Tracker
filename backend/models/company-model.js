const mongoose = require("mongoose") ;

const companySchema = mongoose.Schema({
    companyName : {
        type : String ,
        required : true ,
        lowercase : true ,
        trim : true
    },
    companyEmail : {
        type : String ,
        required : true ,
        unique : true
    },
    companyPassword : {
        type : String ,
        required : true
    },
    companyCountry : {
        type : String ,
        required : true
    },
    baseCurrency : {
        type : String ,
        required : true
    },
    managerCount : {
        type : Number ,
        default : 0
    },
    employeeCount : {
        type : Number ,
        default : 0
    }
})
const companyModel = mongoose.model("Company" , companySchema) ;

module.exports = companyModel ;