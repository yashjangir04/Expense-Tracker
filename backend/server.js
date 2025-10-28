const express = require("express") ;
const app = express() ;
const dotenv = require("dotenv") ;
const companyRouter = require("./routes/company-router") ;
const userRouter = require("./routes/user-router") ;
const expenseRouter = require("./routes/expense-router") ;
const jwtAuthenticator = require("./utils/jwt-verify") ;
const emailSender = require("./utils/email-sender") ;
const cors = require("cors") ;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

dotenv.config() ;
const db = require("./models/db-connect") ;

app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;
app.use("/company" , companyRouter) ;
app.use("/users" , userRouter) ;
app.use("/expense" , expenseRouter) ;
app.use("/jwtverify" , jwtAuthenticator) ;
app.use("/sendemail" , emailSender) ;

app.listen(3000 , () => {
    console.log("Server Running on PORT:3000 ✅")
})