const express = require("express");
const router = express.Router();
const {
  handleServeHomeFile,
  handleGetLatestCaseID,
  handleAddComplaint,
  handleAddProcess,
  handleUpdateStatus,
  handleGetAllCases,
  handleCloseCase,
} = require("../controllers/index");

router.get("/", handleServeHomeFile);
router.get("/api/getLatestCaseId", handleGetLatestCaseID);
router.get("/api/getCases", handleGetAllCases);
router.post("/api/addComplaint", handleAddComplaint);
router.post("/api/addProcess/:caseId", handleAddProcess);
router.post("/updateStatus/:caseId/:index", handleUpdateStatus);
router.post("/api/closeCase/:caseId", handleCloseCase);

module.exports = router ;
