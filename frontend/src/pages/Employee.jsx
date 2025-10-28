import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Employee = () => {
  const [expenses, setExpenses] = useState([]);
  const [waitingApprovalAmount, setWaitingApprovalAmount] = useState(0);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [userid, setUserid] = useState("");
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [conv, setConv] = useState({});

  const [formData, setFormData] = useState({
    description: "",
    category: "",
    amount: "",
    currency: "",
    date: "",
    paidBy: "",
    remarks: "",
    receipt: null,
  });

  useEffect(() => {
    let waiting = 0,
      approved = 0;

    setWaitingApprovalAmount(waiting);
    setApprovedAmount(approved);

    const getConversionDets = async () => {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
      );
      const data = await res.json();
      setConv(data.eur);
    };

    getConversionDets();

    const getCurrencies = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/jwtverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.msg === "Unauthorized Access") {
        return;
      }
      setUser(data);

      let companyId = data.CompanyExist
        ? data.CompanyExist._id
        : data.UserExist.userCompany;
      if (data.UserExist) {
        let userId = data.UserExist._id;

        setUserid(userId);
      }

      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=currencies"
        );
        const data = await res.json();

        const currencySet = new Set();
        data.forEach((c) => {
          if (c.currencies) {
            Object.keys(c.currencies).forEach((code) => currencySet.add(code));
          }
        });
        const getUserData = await fetch(
          "http://localhost:3000/users/api/getusers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ companyId: companyId }),
          }
        );
        const userInfo = await getUserData.json();

        setUsers(userInfo);

        setCurrencies([...currencySet]);
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
      }
    };

    getCurrencies();
  }, []);

  useEffect(() => {
    const getExpenses = async () => {
      if (!userid) return;
      console.log(userid);

      const res = await fetch("http://localhost:3000/users/api/getmyexpenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userid }),
      });

      const data = await res.json();
      let totalWaiting = 0,
        totalApproved = 0;

      const compCurrency =
        user.UserExist.userCompany.baseCurrency.toLowerCase();

      data.forEach((d) => {
        let cur = d.currency.toLowerCase();
        let e2c = conv[cur],
          c2e = 1 / e2c;
        let amt = d.amount;
        console.log(cur);

        let convAmt = Math.round(amt * c2e * conv[compCurrency]);

        if (d.status === "Submitted") {
          totalWaiting += convAmt;
        } else if (d.status === "Accepted") {
          totalApproved += convAmt;
        }
      });
      setApprovedAmount(totalApproved);
      setWaitingApprovalAmount(totalWaiting);
      setExpenses(data);
    };

    getExpenses();
  }, [userid, refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, receipt: file }));

    // create FormData to send to backend
    const data = new FormData();
    data.append("receipt", file);

    try {
      const res = await fetch("http://localhost:3000/qr/scan", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      // console.log(result);

      if (result && Object.keys(result).length > 0) {
        setFormData((prev) => ({
          ...prev,
          description: result.description || prev.description,
          amount: result.amount || prev.amount,
          category: result.category || prev.category,
          currency: result.currency || prev.currency,
          paidBy: result.paidBy || prev.paidBy,
          date: result.date || prev.date,
        }));
      } else {
        alert("No QR code detected. Please enter details manually.");
      }
    } catch (err) {
      console.error("QR scan error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      userId: userid,
      description: formData.description,
      date: formData.date,
      category: formData.category,
      paidBy: formData.paidBy,
      remarks: formData.remarks,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
    };
    console.log(newExpense);

    const res = await fetch("http://localhost:3000/expense/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    });

    const data = await res.json();
    console.log(data);

    setWaitingApprovalAmount(waitingApprovalAmount + newExpense.amount);
    setShowUploadModal(false);

    setFormData({
      description: "",
      category: "",
      amount: "",
      currency: "INR",
      date: "",
      paidBy: "",
      remarks: "",
    });
    setRefresh(!refresh);
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen text-white py-16 font-sans pt-[100px] mt-5 px-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">My Expenses</h1>
        <button
          className="bg-gray-300 text-black cursor-pointer font-normal px-6 py-2 rounded-xl hover:bg-gray-400 transition duration-300"
          onClick={() => setShowUploadModal(true)}
        >
          + Upload Expense
        </button>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
          <p className="text-sm text-zinc-400">To Submit</p>
          <p className="text-2xl font-bold text-white">
            0 {user.UserExist?.userCompany.baseCurrency}
          </p>
        </div>
        <div className="bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
          <p className="text-sm text-zinc-400">Waiting Approval</p>
          <p className="text-2xl font-bold text-yellow-400">
            {waitingApprovalAmount} {user.UserExist?.userCompany.baseCurrency}
          </p>
        </div>
        <div className="bg-zinc-800 p-5 rounded-xl shadow-lg text-center">
          <p className="text-sm text-zinc-400">Approved</p>
          <p className="text-2xl font-bold text-green-400">
            {approvedAmount} {user.UserExist?.userCompany.baseCurrency}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-700 text-left text-zinc-200">
            <tr>
              <th className="p-4 border-b border-zinc-600">Category</th>
              <th className="p-4 border-b border-zinc-600">Date</th>
              <th className="p-4 border-b border-zinc-600">Paid By</th>
              <th className="p-4 border-b border-zinc-600">Amount</th>
              <th className="p-4 border-b border-zinc-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <React.Fragment key={exp._id}>
                <tr
                  onClick={() => toggleRow(exp._id)}
                  className="hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <td className="p-4 border-b border-zinc-700">
                    {exp.category}
                  </td>
                  <td className="p-4 border-b border-zinc-700">
                    {exp.date.substr(0, 10)}
                  </td>
                  <td className="p-4 border-b border-zinc-700">
                    {exp.paidBy.userName}
                  </td>
                  <td className="p-4 border-b border-zinc-700 font-semibold">
                    {exp.amount} {exp.currency}
                  </td>
                  <td
                    className={`p-4 border-b border-zinc-700 font-semibold ${
                      exp.status === "Accepted"
                        ? "text-green-400"
                        : exp.status === "Submitted"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {exp.status}
                  </td>
                </tr>

                {/* Expandable Details */}
                <tr>
                  <td colSpan="6" className="p-0">
                    <AnimatePresence initial={false}>
                      {expandedRow === exp._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden bg-zinc-900 border-t border-zinc-700"
                        >
                          <div className="p-4 text-zinc-300 space-y-2">
                            <p>
                              <span className="font-semibold text-zinc-200">
                                Description:
                              </span>{" "}
                              {exp.description}
                            </p>
                            <p>
                              <span className="font-semibold text-zinc-200">
                                Remarks:
                              </span>{" "}
                              {exp.remarks}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-zinc-800 p-6 rounded-xl w-[95%] max-w-lg shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-4 right-4 bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 text-white cursor-pointer duration-300"
                onClick={() => setShowUploadModal(false)}
              >
                Close
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Upload Expense
              </h2>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-zinc-700 text-white flex-1 outline-none"
                    required
                  />
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                  >
                    {currencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                  required
                />
                <select
                  name="paidBy"
                  value={formData.paidBy}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                  required
                >
                  <option value="">Paid By</option>
                  {users.map((emp) => (
                    <option key={emp.userName} value={emp.userName}>
                      {emp.userName}
                    </option>
                  ))}
                </select>
                <textarea
                  name="remarks"
                  placeholder="Remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-zinc-700 text-white outline-none"
                />

                <div className="flex flex-row items-center justify-between">
                  <p>Fill using receipt</p>
                  <input
                    type="file"
                    accept="image/*"
                    name="receipt"
                    onChange={handleFileChange}
                    className="p-2 rounded-md bg-zinc-700 text-white outline-none cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 rounded-xl text-white font-semibold hover:bg-blue-700 mt-2 cursor-pointer duration-300"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employee;
