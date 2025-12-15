const JobApplication = require("../models/JobApplication");

const createApplication = async (req, res) => {
  try {
    const { companyName, jobTitle, status, notes } = req.body;

    const attachments = req.files?.map(file => ({
      fileName: file.originalname,
      filePath: file.path
    }));

    const application = await JobApplication.create({
      user: req.user._id,
      companyName,
      jobTitle,
      status,
      notes,
      attachments
    });

    res.status(201).json({
      message: "Job application created",
      application
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const updateApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application updated",
      application
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
};
