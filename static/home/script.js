const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.classList.contains('closed-side')){
    toggleBtn.classList.remove("closed-side")
  }
  else{
    toggleBtn.className += "closed-side"
  }
  const isSidebarHidden = sidebar.style.left === '-250px';
  sidebar.style.left = isSidebarHidden ? '0' : '-250px';
  content.style.marginLeft = isSidebarHidden ? '250px' : '0';
  toggleBtn.innerHTML = isSidebarHidden ? '&#x02190;' : '&#x02192;';
});