const complaint = require("../model/add_comp");

function handleServeHomeFile(req, res) {
  return res.sendFile(path.join(__dirname, "static", "home", "index.html"));
}

async function handleGetLatestCaseID(req, res) {
  try {
    const latestCase = await complaint.findOne(
      {},
      { caseIdInput: 1 },
      { sort: { caseIdInput: -1 } }
    );
    const latestCaseId = latestCase ? latestCase.caseIdInput : startID;
    return res.json({ latestCaseId });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
  }
}

async function handleAddComplaint(req, res) {
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
    assignedTeam,
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
      "complaint_details.assigned_team": assignedTeam,
      "complaint_details.complaint_priority": priorityInput,
      "complaint_details.date_and_time_of_incident": incidentDateTimeInput,
    });

    console.log("Complaint created successfully: ", response);
    return res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.json({ status: "error", error: "User Already Registered" });
    }
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
  }
}

async function handleAddProcess(req, res) {
  const { caseId } = req.params;
  const { processText, assignedTeam } = req.body;

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

    return res.json({ status: "ok", updatedComplaint });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
  }
}

async function handleUpdateStatus(req, res) {
  try {
    const caseId = req.params.caseId;
    const index = req.params.index;
    const newStatus = req.body.newStatus;

    const complain = await complaint.findOne({ caseIdInput: caseId });
    complain.processes[index].status = newStatus;
    await complain.save();

    return res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleCloseCase(req, res) {
  const { caseId } = req.params;
  try {
    const updatedComplaint = await complaint.findOneAndUpdate(
      { caseIdInput: caseId },
      { closed: true }
    );

    return res.json({ status: "ok", updatedComplaint });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
  }
}

async function handleGetAllCases(req, res) {
  try {
    const cases = await complaint.find(); // Fetch all cases from MongoDB
    return res.json(cases);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
  }
}

module.exports = {
  handleServeHomeFile,
  handleGetLatestCaseID,
  handleAddComplaint,
  handleAddProcess,
  handleUpdateStatus,
  handleGetAllCases,
  handleCloseCase,
};
