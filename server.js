const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const complaint = require("./model/add_comp");

mongoose.connect("mongodb://localhost:27017/police_complaint", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json()); // Add this middleware to parse JSON requests

// Serve static files from the 'static' directory
app.use("/", express.static(path.join(__dirname, "static")));
app.use("/", express.static(path.join(__dirname, "static","home")));

// Add a route to serve your home/index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "home", "index.html"));
});

app.get("/api/getLatestCaseId", async (req, res) => {
  try {
    const latestCase = await complaint.findOne(
      {},
      { caseIdInput: 1 },
      { sort: { caseIdInput: -1 } }
    );
    const latestCaseId = latestCase ? latestCase.caseIdInput : startID;
    res.json({ latestCaseId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.post("/api/addComplaint", async (req, res) => {
  const {
    caseIdInput,
    caseRegisteredDateTimeInput,
    complainerVisitDateTimeInput,
    complainerFullName,
    aadharCardInput,
    mobileNumberInput,
    altMobileNumberInput,
    complainerEmailInput,
    complainerAltEmailInput,
    complainer_address,
    dobInput,
    sameAsComplainerCheckbox,
    victimFullNameInput,
    relationshipInput,
    complainCategoryInput,
    caseDescriptionInput,
    priorityInput,
    incidentDateTimeInput,
  } = req.body;

  try {
    let victimName = victimFullNameInput;
    let complainerName = complainerFullName;
    let relationship = relationshipInput;

    if (sameAsComplainerCheckbox) {
      victimName = complainerFullName;
      relationship = null;
    }

    const response = await complaint.create({
      caseIdInput,
      sameAsComplainerCheckbox,
      "complainer_details.date_of_case_registered": caseRegisteredDateTimeInput,
      "complainer_details.date_of_complainer_visit":
        complainerVisitDateTimeInput,
      "complainer_details.name_of_complainer": complainerName,
      "complainer_details.aadhar_card_number": aadharCardInput,
      "complainer_details.complainer_mobile_number": mobileNumberInput,
      "complainer_details.complainer_alternative_number": altMobileNumberInput,
      "complainer_details.complainer_email_address": complainerEmailInput,
      "complainer_details.complainer_alternative_email_address":
        complainerAltEmailInput,
      "complainer_details.curent_address_of_complainer": complainer_address,
      "complainer_details.dob_of_complainer": dobInput,
      "complainer_details.relationship_with_victim": relationship,
      "complainer_details.victim_name": victimName,
      "complaint_details.complaint_category": complainCategoryInput,
      "complaint_details.complaint_description": caseDescriptionInput,
      "complaint_details.complaint_priority": priorityInput,
      "complaint_details.date_and_time_of_incident": incidentDateTimeInput,
    });

    console.log("Complaint created successfully: ", response);
    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.json({ status: "error", error: "User Already Registered" });
    }
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.post("/api/addProcess/:caseId", async (req, res) => {
  const { caseId } = req.params;
  const { processText, assignedTeam} = req.body;

  try {
    const updatedComplaint = await complaint.findOneAndUpdate(
      { caseIdInput: caseId },
      {
        $push: {
          processes: {
            timestamp: new Date(),
            text: processText,
            assignTeam: assignedTeam,
          },
        },
      },
      { new: true }
    );

    res.json({ status: "ok", updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.post('/updateStatus/:caseId/:index', async (req, res) => {
  try {
     const caseId = req.params.caseId; // This is the caseIdInput value
     const index = req.params.index;
     const newStatus = req.body.newStatus;
 
     // Find the document by caseIdInput, not by _id
     const complain = await complaint.findOne({ caseIdInput: caseId });
 
     // Update the status in the processes array
     complain.processes[index].status = newStatus;
 
     // Save the updated document
     await complain.save();
 
     res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
  }
 });
 

app.post("/api/closeCase/:caseId", async (req, res) => {
  const { caseId } = req.params;

  try {
    const updatedComplaint = await complaint.findOneAndUpdate(
      { caseIdInput: caseId },
      { closed: true }
    );

    res.json({ status: "ok", updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.get("/api/getCases", async (req, res) => {
  try {
    const cases = await complaint.find(); // Fetch all cases from MongoDB
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("server up at localhost:3000");
});
