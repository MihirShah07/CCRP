document.addEventListener("DOMContentLoaded", async () => {
  const cardContainer = document.getElementById("cardContainer");
  const modal = document.getElementById("exampleModalLong");

  try {
    // Fetch data from your server
    const response = await fetch("/api/getCases");
    const cases = await response.json();

    // Generate Bootstrap cards
    cases.forEach((caseData, index) => {
      if (index % 3 === 0) {
        // Start a new row for every third card
        const cardRow = document.createElement("div");
        cardRow.className = "row";
        cardContainer.appendChild(cardRow);
      }

      const statusIndicator = document.createElement("div");
      statusIndicator.className = "status-indicator";
      statusIndicator.innerText = caseData.closed ? 'Closed' : "Ongoing";
      statusIndicator.style.backgroundColor = caseData.closed ? "red" : "#0069d9";

      const cardCol = document.createElement("div");
      cardCol.className = "col-md-4"; // Bootstrap grid class for a 4-column layout

      const card = document.createElement("div");
      card.className = "card m-1";
      card.style = "";

      card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">CASEID: ${caseData.caseIdInput}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Complainer Name: ${caseData.complainer_details.name_of_complainer}</h6>
              <p class="card-text">Category: ${caseData.complaint_details.complaint_category}</p>
              <p class="card-text">Priority: ${caseData.complaint_details.complaint_priority}</p>
            </div>
          `;
          card.appendChild(statusIndicator);
      card.addEventListener("click", () => {
        openModal(caseData);
      });
      
      cardCol.appendChild(card);
      cardContainer.lastElementChild.appendChild(cardCol);
    });
  } catch (error) {
    console.error(error);
  }

  function openModal(caseData) {
    const modalContent = `
        <div class="modal-dialog" style="max-width: 950px;" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${caseData.caseIdInput}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p><b>Registration Date:</b> ${formatDate(
                caseData.complainer_details.date_of_case_registered
              )}</p>
              <p><b>Incident Date:</b> ${formatDate(
                caseData.complaint_details.date_and_time_of_incident
              )}</p>
              <p><b>Victim Name:</b> ${caseData.complainer_details.victim_name}</p>
              <p><b>Complainer Name:</b> ${
                caseData.complainer_details.name_of_complainer
              }</p>
              <p><b>Case Priority:</b> ${
                caseData.complaint_details.complaint_priority
              }</p>
              <p><b>Case Category:</b> ${
                caseData.complaint_details.complaint_category
              }</p>
              <p><b>Case Details:</b> ${
                caseData.complaint_details.complaint_description
              }</p> 
              <p><b>Assigned Team:</b> ${caseData.complaint_details.assigned_team}</p>             
            </div>

            <!-- Table for displaying process data -->
            <table class="table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th style="width:350px;">Task Details</th>
                  <th>Assigned Team</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${generateProcessTableRows(caseData.processes, caseData)}
              </tbody>
            </table>
            <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="addProcessBtn" ${
              caseData.closed ? "disabled" : ""
            }>Update Progress</button>
            <button type="button" class="btn btn-danger" id="closeCaseBtn" ${
              caseData.closed ? "disabled" : ""
            }>Close Case</button>
          </div>
          </div>
        </div>
      `;

    modal.innerHTML = modalContent;
    $("#exampleModalLong").modal("show");

    document.getElementById("addProcessBtn").addEventListener("click", () => {
      // Call a function to handle the "Add Process" functionality
      handleAddProcess(caseData);
    });

    document.getElementById("closeCaseBtn").addEventListener("click", () => {
      // Call a function to handle the "Close Case" functionality
      handleCloseCase(caseData);
    });

    function formatDate(dateTimeString) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = new Date(dateTimeString).toLocaleString(
        "en-US",
        options
      );
      return formattedDate;
    }
  }
});

function handleAddProcess(caseData) {
  const modalBody = document.querySelector(".modal-body");

  // Create a new form
  const processForm = document.createElement("form");
  processForm.innerHTML = `
    <div class="form-group">
      <label for="processDateTime">Date & Time:</label>
      <input type="datetime-local" id="processDateTime" class="form-control" disabled>
    </div>
    <div class="form-group">
      <label for="teamAssign">Task Incharge:</label>
      <select id="teamAssign" class="form-control">
      <option value="Agent Emily Lawson (Digital Forensic Investigator)">Agent Emily Lawson (Digital Forensic Investigator)</option>
      <option value="Detective Marcus Steele (Cybersecurity Analyst)">Detective Marcus Steele (Cybersecurity Analyst)</option>
      <option value="Investigator Ava Chen (Network Security Specialist)">Investigator Ava Chen (Network Security Specialist)</option>
      <option value="Special Agent Jason Rodriguez (Incident Responder)">Special Agent Jason Rodriguez (Incident Responder)</option>
      <option value="Cyber Analyst Samantha Greene (Malware Analyst)">Cyber Analyst Samantha Greene (Malware Analyst)</option>
      <option value="Officer Ethan Blackwell (Cyber Intelligence Officer)">Officer Ethan Blackwell (Cyber Intelligence Officer)</option>
      <option value="Investigative Specialist Natalie Martinez (Threat Hunter)">Investigative Specialist Natalie Martinez (Threat Hunter)</option>
      <option value="Cybersecurity Expert Caleb Harper (Security Consultant)">Cybersecurity Expert Caleb Harper (Security Consultant)</option>
      <option value="Detective Maya Patel (Cryptocurrency Investigator)">Detective Maya Patel (Cryptocurrency Investigator)</option>
      <option value="Special Agent Ryan Mitchell (Cybercrime Prosecutor)">Special Agent Ryan Mitchell (Cybercrime Prosecutor)</option>
      </select>
    </div>
    <div class="form-group">
      <label for="processDetails">Task Details:</label>
      <textarea id="processDetails" class="form-control" rows="3"></textarea>
    </div>
    <button type="button" class="btn btn-primary" id="submitProcessBtn">Submit</button>
  `;

  modalBody.innerHTML = ""; // Clear existing content
  modalBody.appendChild(processForm);

  const processDateTimeInput = document.getElementById("processDateTime");
  const currentDateTime = getCurrentDateTime();
  processDateTimeInput.value = currentDateTime;
  processDateTimeInput.setAttribute("min", currentDateTime); // Set the minimum value to the current date and time

  // Attach a click event handler to the submit button
  document.getElementById("submitProcessBtn").addEventListener("click", () => {
    handleSubmitProcess(caseData);
  });
}

function handleCloseCase(caseData) {
  const { caseIdInput, processes } = caseData;

  const allProcessesCompleted = processes.every(process => process.status === 'completed');

  if (!allProcessesCompleted) {
     alert('All processes must be completed before closing the case.');
     return;
  }
  // Assuming you have a backend API endpoint for closing the case
  fetch(`/api/closeCase/${caseIdInput}`, {
    // Update the URL to include caseId
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ caseId: caseIdInput }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        // Case successfully closed
        console.log(`Case ${caseIdInput} closed successfully`);

        // Disable the "Close Case" button
        const closeCaseBtn = document.getElementById("closeCaseBtn");
        const addProcessBtn = document.getElementById("addProcessBtn");
        closeCaseBtn.disabled = true;
        addProcessBtn.disabled = true;
        location.reload();
      } else {
        console.error("Error closing the case:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error closing the case:", error);
    });
}

function handleSubmitProcess(caseData) {
  // Get the input values
  const { caseIdInput } = caseData;
  const processDateTime = document.getElementById("processDateTime").value;
  const processDetails = document.getElementById("processDetails").value;
  const assignedTeam = document.getElementById("teamAssign").value;

  // Ensure the process details are not empty
  if (processDetails.trim() === "") {
    alert("Please provide process details.");
    return;
  }

  if (assignedTeam.trim() === "") {
    alert("Please provide Team.");
    return;
  }
  // Fetch the URL for adding the process to the database
  const addProcessUrl = `/api/addProcess/${caseIdInput}`;
  // Make the POST request to add the process
  fetch(addProcessUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      processText: processDetails,
      assignedTeam: assignedTeam,
    }), // Pass process details in the request body
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        // Process added successfully
        console.log(`Process added successfully`);
        // Disable the "Add Process" button after adding the process
        const addProcessBtn = document.getElementById("addProcessBtn");
        addProcessBtn.disabled = true;
        location.reload();
        // Optionally, update the UI or perform any other actions
      } else {
        // Handle error
        console.error("Error adding process:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error adding process:", error);
    })
    .finally(() => {
      // Optionally, close the modal after submission
      $("#exampleModalLong").modal("hide");
    });
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  // Ensure the format is 'YYYY-MM-DDTHH:mm'
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function generateProcessTableRows(processes, caseData) {
  if (!processes || processes.length === 0) {
     return '<tr><td colspan="5">No processes available.</td></tr>';
  }
 
  return processes
     .map(
       (process, index) => `
     <tr>
       <td>${process.timestamp}</td>
       <td>${process.text}</td>
       <td>${process.assignTeam}</td>
       <td>
         <select id="statusSelect_${index}">
           <option value="pending" ${
             process.status === "pending" ? "selected" : ""
           }>Pending</option>
           <option value="inprogress" ${
             process.status === "inprogress" ? "selected" : ""
           }>In Progress</option>
           <option value="completed" ${
             process.status === "completed" ? "selected" : ""
           }>Completed</option>
         </select>
       </td>
       <td>
       <button class="btn btn-primary" data-case-id='${caseData.caseIdInput}' data-timestamp='${process.timestamp}' data-index='${index}' onclick="updateStatus(this.getAttribute('data-case-id'), this.getAttribute('data-index'))" ${caseData.closed ? "disabled" : ""}>Update Status</button>
       </td>
     </tr>
  `
     )
     .join("");
 }
 
function updateStatus(caseId, index) {
  const newStatus = document.getElementById(`statusSelect_${index}`).value;
  console.log(`Updating status for caseId: ${caseId}, index: ${index}`);
  // Correctly construct the fetch URL using the provided caseId and index
  fetch(`/updateStatus/${caseId}/${index}`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ newStatus }),
  })
  .then((response) => response.json())
  .then((data) => {
     console.log(data.message);
     location.reload();
     // Handle success, update UI as needed
  })
  .catch((error) => console.error(error));
 }