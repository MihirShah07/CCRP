async function createNewCase() {
  try {
    // Fetch the latest case ID from the server
    const latestCaseIdResponse = await fetch("/api/getLatestCaseId");
    const latestCaseIdData = await latestCaseIdResponse.json();
    const latestCaseId = latestCaseIdData.latestCaseId;

    // Calculate the new case ID
    let newCaseID = latestCaseId + 1;

    // Update the case ID input value
    const caseIdInput = document.getElementById("caseId");
    caseIdInput.value = `${newCaseID}`;
  } catch (error) {
    console.error("Error fetching latest case ID:", error);
  }
}
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const currentDateTime = now.toISOString().slice(0, 16);
  const valDOB = now.toISOString().slice(0,10) // Format: "YYYY-MM-DDTHH:mm"
  // Set the max attribute for the incidentDateTime input
  const incidentDateTimeInput = document.getElementById("incidentDateTime");
  const dob = document.getElementById("dob");
  dob.setAttribute("max",valDOB);
  incidentDateTimeInput.setAttribute("max", currentDateTime);

  const complaintForm = document.getElementById("complaintForm");
  complaintForm.addEventListener("submit", (event) => {
    const incidentDateTime = new Date(
      document.getElementById("incidentDateTime").value
    );
    const caseRegisteredDateTime = new Date(
      document.getElementById("caseRegisteredDateTime").value
    );

    if (incidentDateTime > caseRegisteredDateTime) {
      alert(
        "Incident date and time should be less than the case registration date and time."
      );
      event.preventDefault(); // Prevent form submission
    } else {
      // Validation passed, allow form submission
    }
  });
});
