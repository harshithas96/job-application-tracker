const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const { searchApplications } = require("../controllers/jobSearch");

router.get("/applications/search", userAuth, searchApplications);

module.exports = router;
