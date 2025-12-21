const JobApplication = require("../models/JobApplication");

const searchApplications = async (req, res) => {
  try {
    const {
      keyword = "",
      status = "",
      page = 1,
      limit = 10
    } = req.query;

    const userId = req.user.id;

    const query = { user: userId };

    /* 🔍 KEYWORD SEARCH */
    if (keyword && keyword.trim().length >= 2) {
      query.$or = [
        { companyName: { $regex: keyword, $options: "i" } },
        { jobTitle: { $regex: keyword, $options: "i" } },
        { notes: { $regex: keyword, $options: "i" } }
      ];
    }

    /* 🎯 STATUS FILTER */
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [results, total] = await Promise.all([
      JobApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      JobApplication.countDocuments(query)
    ]);

    
    res.json({
      results,
      total
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};



module.exports = { searchApplications };
