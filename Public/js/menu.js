// Make toggleSidebar available globally
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebar.classList.contains('show')) {
    sidebar.classList.remove('show');
    sidebarToggle.classList.remove('active');
    sidebarToggle.setAttribute('aria-label', 'Open menu');
    sidebarToggle.setAttribute('title', 'Open Menu (Alt+M)');
  } else {
    sidebar.classList.add('show');
    sidebarToggle.classList.add('active');
    sidebarToggle.setAttribute('aria-label', 'Close menu');
    sidebarToggle.setAttribute('title', 'Close Menu (Alt+M)');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const menuLinks = sidebar.querySelectorAll('.menu-link');

  function hideSidebar() {
    sidebar.classList.remove('show');
    sidebarToggle.classList.remove('active');
    sidebarToggle.setAttribute('aria-label', 'Open menu');
    sidebarToggle.setAttribute('title', 'Open Menu (Alt+M)');
  }

  function showSidebar() {
    sidebar.classList.add('show');
    sidebarToggle.classList.add('active');
    sidebarToggle.setAttribute('aria-label', 'Close menu');
    sidebarToggle.setAttribute('title', 'Close Menu (Alt+M)');
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.onclick = toggleSidebar;
    if (sidebarClose) {
      sidebarClose.onclick = hideSidebar;
    }
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('show') &&
        !sidebar.contains(e.target) &&
        e.target !== sidebarToggle
      ) {
        hideSidebar();
      }
    });
    // Hide sidebar when a menu link is clicked (on mobile)
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 700) hideSidebar();
      });
    });
  }
});