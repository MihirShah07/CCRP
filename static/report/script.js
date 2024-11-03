async function generatePDF() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    try {
      const response = await fetch(`/api/getCasesByDate?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (data.status === "error") {
        alert(data.error);
        return;
      }

      // Format data into an HTML table
      let tableHTML = `
        <h2>Complaint Report</h2>
        <table border="1" style="width:100%; border-collapse:collapse;">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Complainer Name</th>
              <th>Incident Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.cases.forEach((caseInfo) => {
        tableHTML += `
          <tr>
            <td>${caseInfo.caseIdInput}</td>
            <td>${caseInfo.complainer_details.name_of_complainer}</td>
            <td>${new Date(caseInfo.complaint_details.date_and_time_of_incident).toLocaleDateString()}</td>
            <td>${caseInfo.complaint_details.complaint_category}</td>
            <td>${caseInfo.complaint_details.complaint_description}</td>
            <td>${caseInfo.closed ? "Closed" : "Ongoing"}</td>
          </tr>
        `;
      });

      tableHTML += `</tbody></table>`;

      // Convert the table to PDF
      const reportContent = document.createElement("div");
      reportContent.innerHTML = tableHTML;
      html2pdf().from(reportContent).save("ComplaintReport.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }
