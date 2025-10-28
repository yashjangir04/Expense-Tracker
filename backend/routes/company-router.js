const express = require("express");
const router = express.Router();
const Company = require("../models/company-model");
const bcrypt = require("bcrypt");

router.post("/create", async (req, res) => {
  const { companyName, email, password, country } = req.body;
  console.log(req.body);
  const country_data = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,currencies",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const countries = await country_data.json() ;

  const countryObj = countries.find((c) => Object.keys(c.currencies)[0] === country);
  if (!countryObj)
    return res.status(400).send({ error: "Invalid country name" });

  const currency = Object.keys(countryObj.currencies)[0].toUpperCase();

  const hashedPassword = await bcrypt.hash(password, 12);

  const new_company = await Company.create({
    companyEmail: email,
    companyPassword: hashedPassword,
    companyName: companyName,
    companyCountry: country,
    baseCurrency: currency,
  });

  return res.status(200).send(new_company);
});

module.exports = router;
