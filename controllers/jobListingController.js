const JobListing = require("../models/JobListing");
const Company = require("../models/Company");

const createJobListing = async (req, res) => {
  try {
    const company = await Company.findOne({
      _id: req.body.company,
      user: req.user._id
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobListing = await JobListing.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      message: "Job listing saved",
      jobListing
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const getJobListings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await JobListing.countDocuments()

    const listings = await JobListing.find({ user: req.user._id })
      .populate("company", "name industry")
      .sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.status(200).json({
            success: true,
            message: "Fetched all user details",
            count: totalCount,
            data: listings
        })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const markAsApplied = async (req, res) => {
  try {
    const listing = await JobListing.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isApplied: true },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.status(200).json({
      message: "Marked as applied",
      listing
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteJobListing = async (req, res) => {
  try {
    const listing = await JobListing.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!listing) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.status(200).json({ message: "Job listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createJobListing,
  getJobListings,
  markAsApplied,
  deleteJobListing
};
