let caseIdCounter = 1;
let startID = 1000005;
function createNewCase() {
  // Increment the case ID counter
  let newCaseID = startID + caseIdCounter;
    console.log(newCaseID);
  // Update the case ID input value
  const caseIdInput = document.getElementById('caseId');
  caseIdInput.value = `${newCaseID}`;
}
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
