const mongoose = require("mongoose") ;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Database Connected Successfully ✅") ;
})
.catch(() => {
    console.log("Database didn't Connect ❌") ;
})

module.exports = mongoose.connection ;