const JobApplication = require("../models/JobApplication");
const mongoose = require("mongoose")

const getDashboardOverview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const stats = await JobApplication.aggregate([
      {
        $match: {
          user: userId
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const overview = {
      total: 0,
      applied: 0,
      interviewed: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };

    for (const stat of stats) {
      overview[stat._id] = stat.count;
      overview.total += stat.count;
    }

    res.status(200).json(overview);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};


const getStatusChartData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const data = await JobApplication.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          value: 1
        }
      }
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTimelineData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const timeline = await JobApplication.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formatted = timeline.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      count: item.count
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getResponseMetrics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const total = await JobApplication.countDocuments({ user: userId });
    const interviews = await JobApplication.countDocuments({
      user: userId,
      status: "interviewed"
    });
    const offers = await JobApplication.countDocuments({
      user: userId,
      status: "offered"
    });

    res.status(200).json({
      totalApplications: total,
      interviewRate: total ? ((interviews / total) * 100).toFixed(2) : 0,
      offerRate: total ? ((offers / total) * 100).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getDashboardOverview,
    getStatusChartData,
    getTimelineData,
    getResponseMetrics
}