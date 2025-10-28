import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Create = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState("");
  const [manager, setManager] = useState("");
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [isSequential, setIsSequential] = useState(false);
  const [minApprovalPercent, setMinApprovalPercent] = useState("");
  let [companyDetails, setCompanyDetails] = useState({});
  const [approvers, setApprovers] = useState({});

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/jwtverify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        setCompanyDetails(data);
        console.log(data);

        if (data.msg === "Unauthorized Access") {
          return;
        }

        let companyId = data.CompanyExist._id;
        // console.log(companyId);

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

        const getManagersData = await fetch(
          "http://localhost:3000/users/api/getmanagers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ companyId: companyId }),
          }
        );
        const managerInfo = await getManagersData.json();
        managerInfo.sort((a, b) => a.userID - b.userID);
        setApprovers(managerInfo);
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };

    verifyToken();
  }, [refresh]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSave = async () => {
    if (isManagerApprover && managerId != "") {
      let n = selectedIds.length ;
      if(n == 0) {
        selectedIds.push(managerId) ;
      }
      else {
        selectedIds.push(selectedIds[0]) ;
        selectedIds[0] = managerId ;
      }
    }

    const newUser = {
      name: userName,
      email,
      role,
      managerId,
      description,
      manager,
      isManagerApprover,
      approvers: selectedIds,
      isSequential,
      minApprovalPercent,
      companyId: companyDetails.CompanyExist._id,
    };

    console.log("🧾 Saved User Data:", newUser);

    const res = await fetch("http://localhost:3000/users/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    // console.log("Response:", data);

    // Clear form & close modal
    setUserName("");
    setEmail("");
    setRole("Employee");
    setDescription("");
    setManager("");
    setIsManagerApprover(false);
    setSelectedIds([]);
    setIsSequential(false);
    setMinApprovalPercent("");
    setIsModalOpen(false);
    setRefresh(prev => !prev);
  };

  const handleSendPassword = async (userEmail) => {
    const companyId = companyDetails.CompanyExist._id;
    const res = await fetch("http://localhost:3000/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail,
        companyId,
      }),
    });

    const data = await res.json();
    // console.log(data);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center pt-[100px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* ====== Top Panel ====== */}
      <div
        className={`w-[95%] min-h-[50%]  rounded-xl relative px-4 py-6 ${
          users.length === 0 ? "grid place-items-center" : ""
        }`}
      >
        <button
          className="bg-gray-300 px-8 py-2 rounded-2xl ml-2 mt-2 text-black cursor-pointer duration-300 hover:bg-gray-400 absolute top-5 left-5"
          onClick={() => setIsModalOpen(true)}
        >
          <IoMdAdd className="inline pb-1 text-xl" />
          <span>New</span>
        </button>

        {/* ====== Users Table ====== */}
        <div className="overflow-x-auto px-20 mt-5 rounded-xl overflow-y-hidden">
          {users.length === 0 ? (
            <h1 className="text-zinc-400">No Users Found</h1>
          ) : (
            <table className="w-full border-collapse mt-10">
              <thead>
                <tr className="bg-zinc-800 text-left text-sm uppercase tracking-wider">
                  <th className="p-3 rounded-tl-lg">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Manager</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 rounded-tr-lg text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="bg-zinc-800 transition-colors"
                  >
                    <td className="p-3 border border-zinc-600">{index + 1}</td>
                    <td className="p-3 border border-zinc-600">
                      {user.userName}
                    </td>
                    <td className="p-3 border border-zinc-600">
                      {user.userRole}
                    </td>
                    <td className="p-3 border border-zinc-600">
                      {user.userManager}
                    </td>
                    <td className="p-3 border border-zinc-600">
                      {user.userEmail}
                    </td>
                    <td className="p-3 border border-zinc-600 text-center">
                      <button
                        className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-1 rounded-md transition-all duration-200 cursor-pointer"
                        onClick={() => handleSendPassword(user.userEmail)}
                      >
                        Send Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ====== Modal ====== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-[#00000098] bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-zinc-800 p-6 rounded-xl w-[98%] min-h-[80%] overflow-y-auto relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white cursor-pointer duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>

              <h1 className="text-3xl font-bold text-white mb-8">
                Create User
              </h1>

              <div className="flex flex-row mt-8 w-full h-full justify-between gap-10">
                {/* LEFT: User Info */}
                <div className="w-1/2 h-full flex flex-col gap-7">
                  <div>
                    <label className="text-white mb-1 block">User</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter user"
                      className="w-full p-2 rounded-md bg-zinc-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white mb-1 block">Email</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email"
                      className="w-full p-2 rounded-md bg-zinc-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white mb-1 block">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 rounded-md bg-zinc-700 text-white outline-none"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Description about rules
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Approval rule for miscellaneous expenses"
                      className="w-full p-2 rounded-md bg-zinc-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-white mb-1 block">Manager</label>
                    <select
                      value={managerId}
                      onChange={(e) => {
                        const selected = approvers.find((mgr) => mgr.userID == e.target.value);
                        console.log(selected);

                        if (selected) {
                          setManager(selected.userName);
                          setManagerId(selected.userID);
                          
                        } else {
                          setManager("");
                          setManagerId("");
                        }
                      }}
                      className="w-full p-2 rounded-md bg-zinc-700 text-white outline-none"
                    >
                      <option value="">Select Manager</option>
                      {approvers.map((mgr) => (
                        <option key={mgr.userID} value={mgr.userID}>
                          {mgr.userName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* RIGHT: Approvers + Settings */}
                <div className="w-1/2">
                  <div>
                    <div className="flex flex-row w-2/3 justify-between mb-10">
                      <label className="text-white mb-1 block border-b-2 border-b-zinc-500 pb-1">
                        Approvers
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={isManagerApprover}
                          onChange={() => setIsManagerApprover((prev) => !prev)}
                        />
                        <span className="text-white">
                          Is Manager an approver?
                        </span>
                      </div>
                    </div>

                    <div className="max-h-[20vh] overflow-y-scroll overflow-x-hidden">
                      {approvers.map((approver, i) =>
                        approver.userID == managerId ? (
                          " "
                        ) : (
                          <div key={i} className="flex items-center gap-4 mb-2">
                            <span className="text-white">
                              {approver.userName}
                            </span>
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-blue-500"
                              checked={selectedIds.includes(approver.userID)}
                              onChange={() =>
                                handleCheckboxChange(approver.userID)
                              }
                            />
                          </div>
                        )
                      )}
                      <div className="mt-4 text-white text-sm">
                        Selected IDs: {selectedIds.join(", ") || "None"}
                      </div>
                    </div>
                  </div>

                  {/* Approvers Sequence */}
                  <div className="flex items-center gap-2 mt-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={isSequential}
                      onChange={() => setIsSequential((prev) => !prev)}
                    />
                    <span className="text-white">Approvers Sequence</span>
                  </div>

                  {/* Minimum Approval Percentage */}
                  <div className="flex items-center gap-2 mt-4">
                    <label className="text-white">
                      Minimum Approval percentage:
                    </label>
                    <input
                      type="number"
                      value={minApprovalPercent}
                      onChange={(e) => setMinApprovalPercent(e.target.value)}
                      className="w-20 p-2 rounded-md bg-zinc-700 text-white outline-none"
                    />
                    <span className="text-white">%</span>
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end mt-10">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white cursor-pointer absolute bottom-5 right-5 duration-300"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Create;
