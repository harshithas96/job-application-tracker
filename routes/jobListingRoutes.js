const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const {
  createJobListing,
  getJobListings,
  markAsApplied,
  deleteJobListing
} = require("../controllers/jobListingController");

router.post("/job-listings", userAuth, createJobListing);
router.get("/job-listings", userAuth, getJobListings);
router.patch("/job-listings/:id/applied", userAuth, markAsApplied);
router.delete("/job-listings/:id", userAuth, deleteJobListing);

module.exports = router;
