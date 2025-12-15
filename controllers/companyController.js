const Company = require("../models/Company");

// CREATE company
const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      message: "Company created",
      company
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// GET all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE company
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated",
      company
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany
};
