const add_Complaint = document.getElementById('add_complaint');
add_Complaint.addEventListener('submit', addComplaint)
async function addComplaint(event) {
    event.preventDefault()
    const firstNameInput = document.getElementById("firstName").value
    const middleNameInput = document.getElementById("middleName").value
    const lastNameInput = document.getElementById("lastName").value

    const caseIdInput = document.getElementById("caseId").value
    const caseRegisteredDateTimeInput = document.getElementById("caseRegisteredDateTime").value
    const complainerVisitDateTimeInput = document.getElementById("complainerVisitDateTime").value
    const complainerFullName = firstNameInput+" "+middleNameInput+" "+lastNameInput;
    const aadharCardInput = document.getElementById("aadharCard").value
    const mobileNumberInput = document.getElementById("mobileNumber").value
    const altMobileNumberInput = document.getElementById("altMobileNumber").value
    const complainerEmailInput = document.getElementById("complainerEmail").value
    const complainerAltEmailInput = document.getElementById("complainerAltEmail").value
    const complainer_address = document.getElementById("complainerAddress").value
    const dobInput = document.getElementById("dob").value
    const sameAsComplainerCheckbox = document.getElementById("sameAsComplainerYes").checked
    // const victimFullNameContainer = document.getElementById("victimFullNameContainer").value
    const victimFullNameInput = document.getElementById("victimFullName").value
    const relationshipInput = document.getElementById("relationship").value
    const complainCategoryInput = document.getElementById("complainCategory").value
    const caseDescriptionInput = document.getElementById("caseDescription").value
    const priorityInput = document.getElementById("priority").value
    const incidentDateTimeInput = document.getElementById("incidentDateTime").value
    // const fileInput = document.getElementById("complainerBioMetric");
    // const selectedFiles = fileInput.files;
    // for (let i = 0; i < selectedFiles.length; i++) {
    //     const file = selectedFiles[i];

    //     if (!file.type.startsWith("image/")) {
    //         alert("Please select a valid image file.");
    //         return; // Stop further processing if a non-image file is selected
    //     }
    // }
  
    const result = await fetch('/api/addComplaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          incidentDateTimeInput
        })
      }).then((res) => res.json())
      if (result.status === 'ok') {
        window.location.href = '../complaint_status/index.html'
      } 
      else {
        alert(result.error)
      }
}