const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

router.post("/companies", userAuth, createCompany);
router.get("/companies", userAuth, getCompanies);
router.put("/companies/:id", userAuth, updateCompany);
router.delete("/companies/:id", userAuth, deleteCompany);

module.exports = router;
