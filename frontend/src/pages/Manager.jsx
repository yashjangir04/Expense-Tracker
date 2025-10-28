import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Manager = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserDets = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/jwtverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      setUser(data);
    };
    getUserDets();
  }, []);

  useEffect(() => {
    if (!user) return;

    const getApprovals = async () => {
      const res = await fetch("http://localhost:3000/expense/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user.UserExist),
      });
      const data = await res.json();
      setApprovals(data);
    };

    getApprovals();
  }, [user, refresh]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleAction = async (id, action) => {
    console.log(action);

    const res = await fetch("http://localhost:3000/expense/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expenseId: id, action }),
    });
    const data = await res.json();
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen text-white py-16 font-sans pt-[100px] mt-5 px-20">
      <h1 className="text-3xl font-semibold mb-8">Approvals to review</h1>

      <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-700 text-left text-zinc-200">
            <tr>
              <th className="p-4 border-b border-zinc-600">Date of Approval</th>
              <th className="p-4 border-b border-zinc-600">Request Owner</th>
              <th className="p-4 border-b border-zinc-600">Category</th>
              <th className="p-4 border-b border-zinc-600">Request Status</th>
              <th className="p-4 border-b border-zinc-600">
                Total amount (in company's currency)
              </th>
              <th
                className="p-4 border-b border-zinc-600 text-center"
                colSpan="2"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {approvals
              .filter((item) => item.status === "Submitted")
              .map((item) => (
                <React.Fragment key={item._id}>
                  <tr
                    onClick={() => toggleRow(item._id)}
                    className="hover:bg-zinc-700 cursor-pointer transition-colors"
                  >
                    <td className="p-4 border-b border-zinc-700">
                      {item.createdAt.substr(0, 10)}
                    </td>
                    <td className="p-4 border-b border-zinc-700">
                      {item.userId?.userName}
                    </td>
                    <td className="p-4 border-b border-zinc-700">
                      {item.category}
                    </td>
                    <td
                      className={`p-4 border-b border-zinc-700 font-semibold ${
                        item.status === "Accepted"
                          ? "text-green-400"
                          : item.status === "Rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-4 border-b border-zinc-700">
                      <span className="text-white font-semibold">
                        {item.amount} {user.UserExist.userCompany.baseCurrency}
                      </span>
                    </td>
                    <td className="p-4 border-b border-zinc-700 text-center">
                      <button
                        disabled={item.status !== "Submitted"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(item._id, "Accepted");
                        }}
                        className={`px-4 py-2 rounded-md duration-300 cursor-pointer bg-[#16fc671c] font-semibold border ${
                          item.status !== "Submitted"
                            ? "border-green-800 text-green-700 cursor-not-allowed opacity-50"
                            : "border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition"
                        }`}
                      >
                        Approve
                      </button>
                    </td>
                    <td className="p-4 border-b border-zinc-700 text-center">
                      <button
                        disabled={item.status !== "Submitted"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(item._id, "Rejected");
                        }}
                        className={`px-4 py-2 duration-300 cursor-pointer bg-[#ff000013] rounded-md font-semibold border ${
                          item.status !== "Submitted"
                            ? "border-red-800 text-red-700 cursor-not-allowed opacity-50"
                            : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
                        }`}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>

                  {/* Smooth expandable details section */}
                  <tr>
                    <td colSpan="7" className="p-0">
                      <AnimatePresence initial={false}>
                        {expandedRow === item._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-zinc-800 border-t border-zinc-700"
                          >
                            <div className="p-4 text-zinc-300 space-y-2">
                              <p>
                                <span className="font-semibold text-zinc-200">
                                  Description:
                                </span>{" "}
                                {item.description}
                              </p>
                              <p>
                                <span className="font-semibold text-zinc-200">
                                  Date of Expense :
                                </span>{" "}
                                {item.date.substr(0, 10)}
                              </p>
                              <p>
                                <span className="font-semibold text-zinc-200">
                                  Paid By :
                                </span>{" "}
                                {item.paidBy.userName}
                              </p>
                              <p>
                                <span className="font-semibold text-zinc-200">
                                  Remarks:
                                </span>{" "}
                                {item.remarks}
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
    </div>
  );
};

export default Manager;
