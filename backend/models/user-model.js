const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  userManager: {
    type: String,
  },
  userManagerId: {
    type: String,
  },
  userDesc: {
    type: String,
  },
  userRole: {
    type: String,
    required: true,
  },
  approverSequence: [
    {
      type: Number
    },
  ],
  userID: {
    type: Number,
  },
  sequenceMatter: {
    type: Boolean,
  },
  minimumApprovalPercentage: {
    type: Number,
  },

  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
