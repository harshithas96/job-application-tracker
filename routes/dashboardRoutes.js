const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");

const {
  getDashboardOverview,
  getStatusChartData,
  getTimelineData,
  getResponseMetrics
} = require("../controllers/dashboardController");

router.get("/dashboard/overview", userAuth, getDashboardOverview);
router.get("/dashboard/status-chart", userAuth, getStatusChartData);
router.get("/dashboard/timeline", userAuth, getTimelineData);
router.get("/dashboard/metrics", userAuth, getResponseMetrics);

module.exports = router;
