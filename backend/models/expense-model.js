const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    comment: [{
      type: String,
      default: "",
      trim: true,
    }],
    isSequenced: {
      type: Boolean,
      default: true,
    },
    approverCount: {
      type: Number,
      default: 0,
    },
    notapproverCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Submitted", "Approved", "Rejected"],
      default: "Submitted",
    },
    currency: {
      type : String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
