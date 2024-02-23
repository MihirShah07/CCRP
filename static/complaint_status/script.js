// script.js

document.addEventListener('DOMContentLoaded', async () => {
    const cardContainer = document.getElementById('cardContainer');
    const modal = document.getElementById('exampleModalLong');
  
    try {
      // Fetch data from your server
      const response = await fetch('/api/getCases');
      const cases = await response.json();
  
      // Generate Bootstrap cards
      cases.forEach((caseData) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style = 'width: 18rem;';
  
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">CASEID: ${caseData.caseIdInput}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Complainer Name: ${caseData.complainer_details.name_of_complainer}</h6>
            <p class="card-text">Category: ${caseData.complaint_details.complaint_category}</p>
            <p class="card-text">Priority: ${caseData.complaint_details.complaint_priority}</p>
            </div>
        `;
  
        card.addEventListener('click', () => {
          openModal(caseData);
        });
  
        cardContainer.appendChild(card);
      });
    } catch (error) {
      console.error(error);
    }
  
    function openModal(caseData) {
      const modalContent = `
        <div class="modal-dialog" style="max-width: 800px;" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${caseData.caseIdInput}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Registration Date: ${caseData.complainer_details.date_of_case_registered}</p>
              <p>Victim Name: ${caseData.complainer_details.victim_name}</p>
              <p>Complainer Name: ${caseData.complainer_details.name_of_complainer}</p>
              <p>Case Priority: ${caseData.complaint_details.complaint_priority}</p>
              <p>Case Category: ${caseData.complaint_details.complaint_category}</p>
              <p>Case Details: ${caseData.complaint_details.complaint_description}</p>              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      `;
  
      modal.innerHTML = modalContent;
      $('#exampleModalLong').modal('show');
    }
  });
  