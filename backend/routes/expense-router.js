const express = require("express");
const Expense = require("../models/expense-model");
const User = require("../models/user-model");
const Company = require("../models/company-model");
const router = express.Router();

let conv = {};
const getConversionDets = async () => {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
  );
  const data = await res.json();
  conv = data.eur;
};

getConversionDets();

router.post("/create", async (req, res) => {
  const data = req.body;

  const {
    userId,
    description,
    category,
    amount,
    currency,
    date,
    paidBy,
    remarks,
  } = data;

  const UserExists = await User.findOne({ _id: userId });
  const companyId = UserExists.userCompany;
  const payingUser = await User.findOne({
    userName: paidBy,
    userCompany: companyId,
  });

  const new_expense = await Expense.create({
    userId,
    description,
    category,
    amount,
    currency,
    date,
    paidBy: payingUser,
    remarks,
  });

  return res.status(200).send(new_expense);
});

router.post("/fetch", async (req, res) => {
  const data = req.body;
  const managerId = data.userID;
  const companyId = data.userCompany;

  const comp = await Company.findOne({ _id: companyId });
  const compCurrency = comp?.baseCurrency.toLowerCase();

  const allExp = await Expense.find().populate("userId").populate("paidBy" , "userName");
  console.log(allExp[0]);
  

  const filteredExpenses = allExp.filter((exp) => {
    let seq = exp.userId.approverSequence || [];
    let currentIndex = exp.approverCount + exp.notapproverCount;
    let approverSequenceMatters = exp.userId.sequenceMatter ;
    if(!approverSequenceMatters && seq.includes(managerId)) {
      return true ;
    }
    

    return managerId === seq[currentIndex];
  });

  filteredExpenses.forEach((exp) => {
    let cur = exp.currency.toLowerCase();
    let amt = exp.amount;
    let e2c = conv[cur],
      c2e = 1 / e2c;

    exp.amount = Math.round(amt * c2e * conv[compCurrency]);
  });

  res.status(200).send(filteredExpenses);
});

router.post("/update", async (req, res) => {
  const data = req.body;
  const { expenseId, action } = data;

  const exp = await Expense.findOne({ _id: expenseId }).populate("userId");
  let totalApprovers = exp.userId.approverSequence.length;
  let accepted = exp.approverCount,
    rejected = exp.notapproverCount;
  let toApprovePercentage = exp.userId.minimumApprovalPercentage;
  let toRejectPercentage = 100 - toApprovePercentage;
 
  if(action === "Accepted") {
    await Expense.findOneAndUpdate(
      { _id: expenseId },
      { $inc: { approverCount : 1 } },
      { new: true }
    );
    accepted++ ;
  }
  else {
    await Expense.findOneAndUpdate(
      { _id: expenseId },
      { $inc: { notapproverCount : 1 } },
      { new: true }
    );
    rejected++ ;
  }

  let currRejectPercentage = (rejected / totalApprovers) * 100,
    currAcceptPercentage = (accepted / totalApprovers) * 100;
  
    // console.table({currAcceptPercentage , currRejectPercentage , toApprovePercentage , toRejectPercentage}) ;

  if (currRejectPercentage >= toRejectPercentage) {
    await Expense.findOneAndUpdate(
      { _id: expenseId },
      { $set: { status: "Rejected" } },
      { new: true }
    );
    return res.status(200).send({msg : "User Rejected"}) ;
  }

  if(currAcceptPercentage >= toApprovePercentage) {
    await Expense.findOneAndUpdate(
      { _id: expenseId },
      { $set: { status: "Accepted" } },
      { new: true }
    );
    return res.status(200).send({msg : "User Accepted"}) ;
  }
  return res.status(200).send({msg : "Application in Progress..."}) ;
});

module.exports = router;
