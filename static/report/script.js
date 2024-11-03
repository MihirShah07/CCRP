async function generatePDF() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const typeOfIncident = document.getElementById("typeOfIncident").value;
  const selectTeam = document.getElementById("selectTeam").value;
  const caseStatus = document.getElementById("caseStatus").value;

  const response = await fetch(`/api/getCases?startDate=${startDate}&endDate=${endDate}&typeOfIncident=${typeOfIncident}&selectTeam=${selectTeam}&caseStatus=${caseStatus}`);
  const data = await response.json();

  // // Set the `closed` filter based on `caseStatus` selection
  // let closed;
  // if (caseStatus === "closed") {
  //   closed = true;
  // } else if (caseStatus === "ongoing") {
  //   closed = false;
  // } else {
  //   closed = ""; // Empty value to ignore this filter if not specified
  // }

  // // Construct the API query string
  // const query = new URLSearchParams({
  //   startDate: startDate || "",
  //   endDate: endDate || "",
  //   typeOfIncident: typeOfIncident || "",
  //   selectTeam: selectTeam || "",
  //   closed: closed === "" ? "" : closed  // Only add `closed` if it's not an empty string
  // });

  // Create a printable HTML table with Bootstrap
  let html = `
    <html>
    <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      <style>
        body { font-family: Arial, sans-serif; }
        .table-container { margin: 20px; }
      </style>
    </head>
    <body>
      <div class="table-container">
        <h2>Incident Report</h2>
        <table class="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Assigned Team</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Populate the table rows with case data
  data.forEach(caseData => {
    html += `
      <tr>
        <td>${caseData.caseIdInput}</td>
        <td>${caseData.complaint_details.complaint_category}</td>
        <td>${caseData.complaint_details.complaint_description}</td>
        <td>${caseData.complaint_details.assigned_team}</td>
        <td>${new Date(caseData.complaint_details.date_and_time_of_incident).toLocaleString()}</td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

  // Open a new window and trigger the print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait until the content loads, then open the print dialog
  printWindow.onload = function () {
    printWindow.print();
    printWindow.close();
  };
}