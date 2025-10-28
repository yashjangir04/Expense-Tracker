const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const token = req.body.token;
  
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).send(decoded);
  } catch (err) {
    return res.status(401).send({ msg: "Unauthorized Access" });
  }
});

module.exports = router;