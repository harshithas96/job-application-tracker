const JobApplication = require("../models/JobApplication");

const searchApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      keyword,
      status,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const query = { user: userId };

    
    if (keyword) {
      query.$text = { $search: keyword };
    }

    
    if (status) {
      query.status = status;
    }

    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),

      JobApplication.countDocuments(query)
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      results: applications
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { searchApplications };
