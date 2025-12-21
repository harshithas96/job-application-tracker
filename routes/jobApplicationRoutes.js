const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { userAuth } = require("../middleware/auth");

const {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require("../controllers/jobController");

const { searchApplications } = require("../controllers/jobSearch");

router.post(
  "/applications",
  userAuth,
  upload.single("attachments"),
  createApplication
);

router.get("/applications", userAuth, getMyApplications);

router.get("/applications/search", userAuth, searchApplications);

router.get("/applications/:id", userAuth, getApplicationById);

router.patch("/applications", userAuth, updateApplication);

router.delete("/applications/:id", userAuth, deleteApplication);

module.exports = router;
