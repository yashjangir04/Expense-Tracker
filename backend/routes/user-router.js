const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const companyModel = require("../models/company-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const Expense = require("../models/expense-model");

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const CompanyExist = await companyModel.findOne({ companyEmail: email });

  if (CompanyExist != null) {
    const compResult = await bcrypt.compare(
      password,
      CompanyExist.companyPassword
    );
    if (compResult) {
      var token = jwt.sign({ CompanyExist }, process.env.JWT_SECRET);
      return res.send({ token: token , role : "Admin" });
    } else {
      return res.status(502).send("Something Went Wrong.");
    }
  }

  const UserExist = await userModel.findOne({ userEmail: email }).populate("userCompany");
  if (UserExist) {
    const compResult = await bcrypt.compare(password, UserExist.userPassword);

    if (compResult != null) {
      var token = jwt.sign({ UserExist }, process.env.JWT_SECRET);
      
      return res.send({ token : token , role : UserExist.userRole });
    } else {
      return res.status(502).send("Something Went Wrong.");
    }
  }
  return res.status(500).send("User doesn't exist");
});

router.post("/api/user", async (req, res) => {
  const {
    name,
    role,
    email,
    managerId,
    manager,
    description,
    isManagerApprover,
    approvers,
    isSequential,
    minApprovalPercent,
    companyId,
  } = req.body;

  const password = 10000 + Math.floor(Math.random() * (100001 - 10000));
  const companyDets = await companyModel.findOne({_id : companyId}) ;
  let userID = companyDets.employeeCount + 1 ;
  if(role === "Manager") {
    userID = companyDets.managerCount + 1 ;
    await companyModel.findOneAndUpdate({_id : companyId} , { $inc : {managerCount : 1} }) ;
  }
  else {
    await companyModel.findOneAndUpdate({_id : companyId} , { $inc : {employeeCount : 1} }) ;
  }

  const newUser = await User.create({
    userName: name,
    userEmail: email,
    userPassword: password,
    userCompany: companyId,
    userManager: manager,
    userManagerId: managerId,
    userDesc: description,
    userRole: role,
    approverSequence: approvers,
    sequenceMatter: isSequential,
    minimumApprovalPercentage: minApprovalPercent,
    userID
  });

  res.send(newUser);
});

router.post("/api/getusers", async (req, res) => {
  const companyId = req.body.companyId;
  const users = await User.find({ userCompany: companyId });
  res.send(users);
});

router.post("/api/changepassword", async (req, res) => {
  const { email, tempPassword, newPassword, companyEmail } = req.body;
  try {
    const company = await companyModel.findOne({ companyEmail });
    
    if (!company) {
      res.status(502).send({ msg: "User Doens't Exist" });
    }
    const user = await User.findOne({
      userEmail: email,
      userCompany: company._id,
      userPassword: tempPassword,
    });
    

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          userEmail: email,
          userCompany: company._id,
          userPassword: tempPassword,
        },
        {
          $set: { userPassword: newPassword },
        }
      );
      return res.status(200).send({ msg: "Changed Successfully" });
    }
    return res.status(401).send({ msg: "Something went Wrong" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/api/getmanagers", async (req, res) => {
  const companyId = req.body.companyId;
  const users = await User.find({ userCompany: companyId , userRole : "Manager"});
  res.send(users);
});

router.post("/api/getmyexpenses" , async (req , res) => {
  const { userId } = req.body ;
  
  const myExpenses = await Expense.find({userId}).populate("paidBy") ;
  
  return res.status(200).send(myExpenses) ;
});


module.exports = router;
