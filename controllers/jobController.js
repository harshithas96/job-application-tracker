const JobApplication = require("../models/JobApplication");

const createApplication = async (req, res) => {
  try {
    const { companyName, jobTitle, status, notes } = req.body;

    const attachments = req.file
      ? [{
          fileName: req.file.originalname,
          filePath: req.file.path
        }]
      : [];

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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
        
    const totalCount = await JobApplication.countDocuments()
    const applications = await JobApplication.find({
      user: req.user._id
    }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.status(200).json({
            success: true,
            message: "Fetched all user details",
            count: totalCount,
            data: applications
        })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getApplicationById = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
        
    const totalCount = await JobApplication.countDocuments()
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    }).skip(skip).limit(limit)

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

     res.status(200).json({
            success: true,
            message: "Fetched all user details",
            count: totalCount,
            data: application
        })
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
