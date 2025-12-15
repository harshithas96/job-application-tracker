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

router.post(
  "/applications",
  userAuth,
  upload.array("attachments", 3),
  createApplication
);

router.get("/applications", userAuth, getMyApplications);

router.get("/applications/:id", userAuth, getApplicationById);

router.put("/applications/:id", userAuth, updateApplication);

router.delete("/applications/:id", userAuth, deleteApplication);

module.exports = router;
