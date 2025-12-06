// ====================================
// MENU ENHANCEMENTS JAVASCRIPT
// Personal Finance App v2.0
// ====================================

// ========== Global State ==========
const AppState = {
  currentSection: 'dashboard',
  privacyMode: localStorage.getItem('privacyMode') === 'true',
  darkMode: localStorage.getItem('darkMode') === 'true',
  language: localStorage.getItem('language') || 'en',
  miniMode: localStorage.getItem('miniMode') === 'true',
  sessionStart: Date.now(),
  sessionDuration: 30 * 60 * 1000, // 30 minutes
  notifications: [],
  tourStep: 0,
  tourCompleted: localStorage.getItem('tourCompleted') === 'true'
};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing menu enhancements...');
  
  // Initialize all features
  initializeKeyboardShortcuts();
  initializePrivacyMode();
  initializeDarkMode();
  initializeLanguage();
  initializeMiniMode();
  initializeSessionTimer();
  initializeNotifications();
  initializeMenuGroups();
  initializeBottomNav();
  initializeQuickActions();
  initializeRecentEntries();
  initializeActiveHighlighting();
  initializeSwipeGestures();
  initializeFocusTrap();
  initializeStatePersistence();
  loadDashboardData();
  
  // Note: Onboarding tour is now triggered after successful login in index.html
  
  // Show dashboard by default
  if (localStorage.getItem('lastSection')) {
    showSection(localStorage.getItem('lastSection'));
  } else {
    showSection('dashboard');
  }
});

// ========== Keyboard Shortcuts ==========
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // ESC to close menu
    if (e.key === 'Escape') {
      closeSidebar();
      closeNotifications();
      closeWhatsNew();
      if (document.getElementById('fab Menu').style.display !== 'none') {
        document.getElementById('fabMenu').style.display = 'none';
      }
    }
    
    // Alt + M to toggle menu
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      toggleSidebar();
    }
    
    // Alt + 0-8 for section navigation
    if (e.altKey && e.key >= '0' && e.key <= '8') {
      e.preventDefault();
      const sections = ['dashboard', 'income', 'expenses', 'types', 'savings', 'transfers', 'reports', 'balances', 'settings'];
      const index = parseInt(e.key);
      if (sections[index]) {
        showSection(sections[index]);
      }
    }
    
    // Alt + P for privacy mode
    if (e.altKey && e.key === 'p') {
      e.preventDefault();
      togglePrivacyMode();
    }
    
    // Alt + N for notifications
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      toggleNotifications();
    }
  });
  
  console.log('✓ Keyboard shortcuts initialized');
}

// ========== Privacy Mode ==========
function initializePrivacyMode() {
  if (AppState.privacyMode) {
    document.body.classList.add('privacy-mode');
  }
}

function togglePrivacyMode() {
  AppState.privacyMode = !AppState.privacyMode;
  localStorage.setItem('privacyMode', AppState.privacyMode);
  
  if (AppState.privacyMode) {
    document.body.classList.add('privacy-mode');
    showToast('🔒 Privacy Mode ON - Numbers are hidden');
  } else {
    document.body.classList.remove('privacy-mode');
    showToast('👁️ Privacy Mode OFF - Numbers are visible');
  }
}

// ========== Dark Mode ==========
function initializeDarkMode() {
  const darkModeSwitch = document.getElementById('darkModeSwitch');
  if (darkModeSwitch) {
    darkModeSwitch.checked = AppState.darkMode;
    if (AppState.darkMode) {
      document.body.classList.add('dark-mode');
    }
  }
}

function toggleDarkMode(enabled) {
  AppState.darkMode = enabled;
  localStorage.setItem('darkMode', enabled);
  
  if (enabled) {
    document.body.classList.add('dark-mode');
    showToast('🌙 Dark Mode enabled');
  } else {
    document.body.classList.remove('dark-mode');
    showToast('☀️ Light Mode enabled');
  }
}

// ========== Language Support ==========
const translations = {
  en: {
    language: 'Language',
    dark_mode: 'Dark Mode',
    theme: 'Theme',
    whats_new: "What's New",
    help: 'Help & Tutorial',
    dashboard: 'Dashboard',
    income: 'Income',
    expenses: 'Expenses',
    types: 'Types',
    savings: 'Savings',
    transfers: 'Transfers',
    reports: 'Reports',
    balances: 'Balances',
    settings: 'Settings'
  },
  fr: {
    language: 'Langue',
    dark_mode: 'Mode Sombre',
    theme: 'Thème',
    whats_new: 'Nouveautés',
    help: 'Aide & Tutoriel',
    dashboard: 'Tableau de bord',
    income: 'Revenus',
    expenses: 'Dépenses',
    types: 'Types',
    savings: 'Épargne',
    transfers: 'Transferts',
    reports: 'Rapports',
    balances: 'Soldes',
    settings: 'Paramètres'
  },
  ar: {
    language: 'اللغة',
    dark_mode: 'الوضع الداكن',
    theme: 'المظهر',
    whats_new: 'ما الجديد',
    help: 'المساعدة والدروس',
    dashboard: 'لوحة التحكم',
    income: 'الدخل',
    expenses: 'المصروفات',
    types: 'الأنواع',
    savings: 'المدخرات',
    transfers: 'التحويلات',
    reports: 'التقارير',
    balances: 'الأرصدة',
    settings: 'الإعدادات'
  }
};

function initializeLanguage() {
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = AppState.language;
    changeLanguage(AppState.language);
  }
}

function changeLanguage(lang) {
  AppState.language = lang;
  localStorage.setItem('language', lang);
  
  // Update HTML lang and dir attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  showToast(`✓ Language changed to ${lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}`);
}

// ========== Mini Mode ==========
function initializeMiniMode() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && AppState.miniMode) {
    sidebar.setAttribute('data-mini-mode', 'true');
  }
}

function toggleMiniMode() {
  const sidebar = document.getElementById('sidebar');
  AppState.miniMode = !AppState.miniMode;
  localStorage.setItem('miniMode', AppState.miniMode);
  
  if (sidebar) {
    sidebar.setAttribute('data-mini-mode', AppState.miniMode ? 'true' : 'false');
  }
  
  showToast(AppState.miniMode ? '◀ Mini Mode ON' : '▶ Full Mode ON');
}

// ========== Session Timer ==========
let sessionTimerInterval = null; // Store interval ID

function initializeSessionTimer() {
  const timerElement = document.getElementById('sessionTimeRemaining');
  if (!timerElement) return;
  
  document.getElementById('sessionTimer').style.display = 'flex';
  
  // Clear existing interval if any
  if (sessionTimerInterval) {
    clearInterval(sessionTimerInterval);
  }
  
  sessionTimerInterval = setInterval(() => {
    const elapsed = Date.now() - AppState.sessionStart;
    const remaining = AppState.sessionDuration - elapsed;
    
    if (remaining <= 0) {
      // Session expired
      clearInterval(sessionTimerInterval);
      sessionTimerInterval = null;
      alert('Your session has expired. Please login again.');
      logout();
      return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Warning at 5 minutes
    if (remaining <= 5 * 60 * 1000 && remaining > 4 * 60 * 1000) {
      document.getElementById('sessionTimer').classList.add('session-warning');
      showToast('⚠️ Session will expire in 5 minutes');
    }
  }, 1000);
  
  console.log('✓ Session timer initialized');
}

// Function to stop session timer
function stopSessionTimer() {
  if (sessionTimerInterval) {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
    const timerElement = document.getElementById('sessionTimer');
    if (timerElement) {
      timerElement.style.display = 'none';
    }
  }
}

// ========== Notifications ==========
function initializeNotifications() {
  // Load notifications from storage
  const stored = localStorage.getItem('notifications');
  AppState.notifications = stored ? JSON.parse(stored) : [
    {
      id: 1,
      type: 'info',
      icon: 'ℹ️',
      title: 'Welcome to Personal Finance v2.0!',
      message: 'Check out the new features including Dashboard, Dark Mode, and Multi-language support.',
      time: 'Just now',
      unread: true
    }
  ];
  
  updateNotificationBadge();
}

function addNotification(type, title, message) {
  const notification = {
    id: Date.now(),
    type,
    icon: type === 'info' ? 'ℹ️' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌',
    title,
    message,
    time: 'Just now',
    unread: true
  };
  
  AppState.notifications.unshift(notification);
  localStorage.setItem('notifications', JSON.stringify(AppState.notifications));
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  const unreadCount = AppState.notifications.filter(n => n.unread).length;
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    renderNotifications();
  } else {
    panel.style.display = 'none';
  }
}

function closeNotifications() {
  document.getElementById('notificationPanel').style.display = 'none';
}

function renderNotifications() {
  const list = document.getElementById('notificationList');
  list.innerHTML = '';
  
  if (AppState.notifications.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#999;padding:2em;">No notifications</p>';
    return;
  }
  
  AppState.notifications.forEach(notif => {
    const item = document.createElement('div');
    item.className = `notification-item ${notif.unread ? 'unread' : ''}`;
    item.innerHTML = `
      <span class="notif-icon">${notif.icon}</span>
      <div class="notif-content">
        <strong class="notif-title">${notif.title}</strong>
        <p class="notif-message">${notif.message}</p>
        <span class="notif-time">${notif.time}</span>
      </div>
    `;
    item.onclick = () => {
      notif.unread = false;
      localStorage.setItem('notifications', JSON.stringify(AppState.notifications));
      updateNotificationBadge();
      renderNotifications();
    };
    list.appendChild(item);
  });
}

function markAllNotificationsRead() {
  AppState.notifications.forEach(n => n.unread = false);
  localStorage.setItem('notifications', JSON.stringify(AppState.notifications));
  updateNotificationBadge();
  renderNotifications();
  showToast('✓ All notifications marked as read');
}

// ========== Menu Groups ==========
function initializeMenuGroups() {
  // Restore expanded state
  const expanded = JSON.parse(localStorage.getItem('menuGroupsExpanded') || '{}');
  
  document.querySelectorAll('.menu-group').forEach((group, index) => {
    const header = group.querySelector('.menu-group-header');
    const content = group.querySelector('.menu-group-content');
    const groupId = `group-${index}`;
    
    if (expanded[groupId] === false) {
      content.classList.remove('expanded');
      header.querySelector('.group-arrow').style.transform = 'rotate(0deg)';
    }
  });
  
  console.log('✓ Menu groups initialized');
}

function toggleMenuGroup(header) {
  const group = header.parentElement;
  const content = group.querySelector('.menu-group-content');
  const arrow = header.querySelector('.group-arrow');
  const isExpanded = content.classList.contains('expanded');
  
  if (isExpanded) {
    content.classList.remove('expanded');
    arrow.style.transform = 'rotate(0deg)';
  } else {
    content.classList.add('expanded');
    arrow.style.transform = 'rotate(180deg)';
  }
  
  // Save state
  const expanded = JSON.parse(localStorage.getItem('menuGroupsExpanded') || '{}');
  const groupIndex = Array.from(group.parentElement.querySelectorAll('.menu-group')).indexOf(group);
  expanded[`group-${groupIndex}`] = !isExpanded;
  localStorage.setItem('menuGroupsExpanded', JSON.stringify(expanded));
}

// ========== Active Section Highlighting ==========
function initializeActiveHighlighting() {
  // This will be called by showSection
  console.log('✓ Active highlighting initialized');
}

function updateActiveSection(sectionName) {
  // Remove active class from all links
  document.querySelectorAll('.menu-link, .bottom-nav-item').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current section
  document.querySelectorAll(`[data-section="${sectionName}"]`).forEach(link => {
    link.classList.add('active');
  });
  
  AppState.currentSection = sectionName;
  localStorage.setItem('lastSection', sectionName);
}

// ========== Bottom Navigation ==========
function initializeBottomNav() {
  if (window.innerWidth <= 700) {
    document.getElementById('bottomNav').style.display = 'flex';
  }
  
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 700) {
      document.getElementById('bottomNav').style.display = 'flex';
    } else {
      document.getElementById('bottomNav').style.display = 'none';
    }
  });
  
  console.log('✓ Bottom navigation initialized');
}

// ========== Quick Actions FAB ==========
function initializeQuickActions() {
  if (window.innerWidth <= 700) {
    document.getElementById('quickActionFAB').style.display = 'block';
  }
  
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 700) {
      document.getElementById('quickActionFAB').style.display = 'block';
    } else {
      document.getElementById('quickActionFAB').style.display = 'none';
    }
  });
  
  console.log('✓ Quick actions FAB initialized');
}

function toggleQuickActions() {
  const menu = document.getElementById('fabMenu');
  const button = document.getElementById('fabMainButton');
  
  if (menu.style.display === 'none' || !menu.style.display) {
    menu.style.display = 'flex';
    button.style.transform = 'rotate(45deg)';
  } else {
    menu.style.display = 'none';
    button.style.transform = 'rotate(0deg)';
  }
}

function quickAddIncome() {
  document.getElementById('fabMenu').style.display = 'none';
  document.getElementById('fabMainButton').style.transform = 'rotate(0deg)';
  showSection('income');
  showToast('💵 Add your income');
}

function quickAddExpense() {
  document.getElementById('fabMenu').style.display = 'none';
  document.getElementById('fabMainButton').style.transform = 'rotate(0deg)';
  showSection('expenses');
  showToast('💸 Add your expense');
}

function quickAddTransfer() {
  document.getElementById('fabMenu').style.display = 'none';
  document.getElementById('fabMainButton').style.transform = 'rotate(0deg)';
  showSection('transfers');
  showToast('🔄 Make a transfer');
}

// ========== Recent Entries ==========
function initializeRecentEntries() {
  loadRecentEntries();
  console.log('✓ Recent entries initialized');
}

async function loadRecentEntries() {
  const widget = document.getElementById('recentEntriesContent');
  if (!widget) return;
  
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      widget.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.6);padding:1em;font-size:0.85em;">Login to see recent entries</p>';
      return;
    }
    
    // Fetch recent entries from API
    const response = await fetch('/api/entries?limit=5', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      widget.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.6);padding:1em;font-size:0.85em;">No recent activity</p>';
      return;
    }
    
    const entries = await response.json();
    
    if (!entries || entries.length === 0) {
      widget.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.6);padding:1em;font-size:0.85em;">No recent activity</p>';
      return;
    }
    
    // Get category icons
    const getIcon = (category) => {
      switch(category) {
        case 'income': return '💵';
        case 'expense': return '💸';
        case 'transfer': return '🔄';
        default: return '💰';
      }
    };
    
    // Format date (e.g., "2h ago", "1d ago")
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // seconds
      
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
      return date.toLocaleDateString();
    };
    
    widget.innerHTML = entries.slice(0, 5).map(entry => `
      <div class="recent-entry-item">
        <span class="recent-entry-icon">${getIcon(entry.category)}</span>
        <div class="recent-entry-details">
          <span class="recent-entry-type">${entry.typeName || entry.category}</span>
          <span class="recent-entry-amount privacy-text">${entry.category === 'expense' ? '-' : '+'}${entry.currency}${parseFloat(entry.amount).toFixed(2)}</span>
        </div>
        <span class="recent-entry-date">${formatDate(entry.date)}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent entries:', error);
    widget.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.6);padding:1em;font-size:0.85em;">Error loading entries</p>';
  }
}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent entries:', error);
    widget.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.6);padding:1em;font-size:0.85em;">Error loading entries</p>';
  }
}

// ========== Swipe Gestures (Mobile) ==========
function initializeSwipeGestures() {
  if (window.innerWidth > 700) return;
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });
  
  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
      const sidebar = document.getElementById('sidebar');
      
      // Swipe right to open menu
      if (diffX > 0 && touchStartX < 50) {
        sidebar.classList.add('show');
      }
      
      // Swipe left to close menu
      if (diffX < 0 && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    }
  }
  
  console.log('✓ Swipe gestures initialized');
}

// ========== Focus Trap ==========
function initializeFocusTrap() {
  const sidebar = document.getElementById('sidebar');
  
  sidebar.addEventListener('keydown', function(e) {
    if (!sidebar.classList.contains('show')) return;
    
    const focusableElements = sidebar.querySelectorAll('a, button, input, select, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Tab key
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  console.log('✓ Focus trap initialized');
}

// ========== State Persistence ==========
function initializeStatePersistence() {
  // Restore menu groups state (already done in initializeMenuGroups)
  // Restore last section (done in DOMContentLoaded)
  // All other states are restored on initialization
  console.log('✓ State persistence initialized');
}

// ========== Dashboard Data ==========
async function loadDashboardData() {
  console.log('🔄 Loading dashboard data...');
  try {
    const token = localStorage.getItem('jwtToken');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.log('⚠️ No token found, user not logged in - clearing dashboard');
      // Clear all stats when not logged in
      ['dashTotalIncome', 'dashTotalExpenses', 'dashCurrentBalance', 'dashTotalSavings'].forEach(id => {
        const container = document.getElementById(id);
        if (container) container.innerHTML = '<p class="stat-value privacy-text">--</p>';
      });
      return;
    }
    
    // Fetch data grouped by currency
    console.log('📡 Fetching from /api/dashboard/stats...');
    const response = await fetch('/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API data received:', data);
      
      // Display income by currency
      displayCurrencyStats('dashTotalIncome', data.income || {});
      
      // Display expenses by currency
      displayCurrencyStats('dashTotalExpenses', data.expenses || {});
      
      // Display balances by currency
      displayCurrencyStats('dashCurrentBalance', data.balances || {});
      
      // Display savings by currency
      displayCurrencyStats('dashTotalSavings', data.savings || {});
      
      // Update profile stats with real data
      if (data.totals) {
        document.getElementById('profileEntriesCount').textContent = data.totals.entries || '0';
        const totalBalance = Object.values(data.balances || {}).reduce((sum, val) => sum + val, 0);
        document.getElementById('profileBalanceCount').textContent = formatNumber(totalBalance);
      }
      
      // Update counters with real data
      if (data.counts) {
        document.getElementById('incomeCounter').textContent = data.counts.income || '0';
        document.getElementById('expensesCounter').textContent = data.counts.expenses || '0';
      }
    } else {
      console.log('⚠️ API returned', response.status, '- showing empty state');
      // Show empty state if API fails
      ['dashTotalIncome', 'dashTotalExpenses', 'dashCurrentBalance', 'dashTotalSavings'].forEach(id => {
        const container = document.getElementById(id);
        if (container) container.innerHTML = '<p class="stat-value privacy-text">$0.00</p>';
      });
    }
    
    console.log('✓ Dashboard data loaded');
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error);
    // Show empty state on error
    console.log('⚠️ Showing empty state due to error');
    ['dashTotalIncome', 'dashTotalExpenses', 'dashCurrentBalance', 'dashTotalSavings'].forEach(id => {
      const container = document.getElementById(id);
      if (container) container.innerHTML = '<p class="stat-value privacy-text">$0.00</p>';
    });
  }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function displayCurrencyStats(elementId, currencyData) {
  console.log(`📊 Displaying stats for ${elementId}:`, currencyData);
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`❌ Element not found: ${elementId}`);
    return;
  }
  
  console.log(`✓ Found container: ${elementId}`);
  container.innerHTML = '';
  
  // Sort currencies for consistent display
  const currencies = Object.keys(currencyData).sort();
  console.log(`Currencies to display:`, currencies);
  
  if (currencies.length === 0) {
    console.log(`⚠️ No currencies found, showing default`);
    container.innerHTML = '<p class="stat-value privacy-text">$0.00</p>';
    return;
  }
  
  currencies.forEach(currency => {
    const amount = currencyData[currency];
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    
    console.log(`  ${currency}: ${amount} → ${formatted}`);
    
    const item = document.createElement('p');
    item.className = 'stat-value privacy-text';
    item.textContent = formatted;
    item.title = `Variable: currencyData['${currency}']\nValue: ${amount}\nSource: API /api/dashboard/stats`;
    container.appendChild(item);
  });
  
  console.log(`✅ ${currencies.length} currencies displayed in ${elementId}`);
}

// ========== What's New Modal ==========
function showWhatsNew() {
  document.getElementById('whatsNewModal').style.display = 'flex';
}

function closeWhatsNew() {
  document.getElementById('whatsNewModal').style.display = 'none';
}

// ========== Onboarding Tour ==========
const tourSteps = [
  { target: '#sidebar', title: 'Enhanced Menu', message: 'Your new organized menu with groups, icons, and quick access!' },
  { target: '[data-section="dashboard"]', title: 'Dashboard', message: 'Get a complete overview of your finances at a glance.' },
  { target: '.notification-bell', title: 'Notifications', message: 'Stay updated with important alerts and reminders.' },
  { target: '.privacy-toggle', title: 'Privacy Mode', message: 'Hide sensitive numbers when viewing in public spaces.' },
  { target: '#languageSelect', title: 'Multi-Language', message: 'Switch between English, French, and Arabic.' },
  { target: '#darkModeSwitch', title: 'Dark Mode', message: 'Reduce eye strain with dark mode.' }
];

function startOnboardingTour() {
  AppState.tourStep = 0;
  document.getElementById('onboardingOverlay').style.display = 'block';
  showTourStep();
}

function showTourStep() {
  if (AppState.tourStep >= tourSteps.length) {
    completeTour();
    return;
  }
  
  const step = tourSteps[AppState.tourStep];
  const target = document.querySelector(step.target);
  if (!target) {
    nextTourStep();
    return;
  }
  
  const rect = target.getBoundingClientRect();
  const spotlight = document.querySelector('.onboarding-spotlight');
  const tooltip = document.getElementById('onboardingTooltip');
  
  spotlight.style.top = `${rect.top - 10}px`;
  spotlight.style.left = `${rect.left - 10}px`;
  spotlight.style.width = `${rect.width + 20}px`;
  spotlight.style.height = `${rect.height + 20}px`;
  
  tooltip.style.top = `${rect.bottom + 20}px`;
  tooltip.style.left = `${Math.max(20, rect.left)}px`;
  
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourMessage').textContent = step.message;
  document.getElementById('tourStep').textContent = `Step ${AppState.tourStep + 1} of ${tourSteps.length}`;
}

function nextTourStep() {
  AppState.tourStep++;
  if (AppState.tourStep >= tourSteps.length) {
    completeTour();
  } else {
    showTourStep();
  }
}

function skipTour() {
  completeTour();
}

function completeTour() {
  document.getElementById('onboardingOverlay').style.display = 'none';
  localStorage.setItem('tourCompleted', 'true');
  AppState.tourCompleted = true;
  showToast('✓ Tour completed! Explore at your own pace.');
}

// ========== Toast Notifications ==========
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 1em 2em;
    border-radius: 25px;
    z-index: 99999;
    animation: slideUp 0.3s;
    font-size: 0.9em;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(100px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ========== Override showSection to add active highlighting ==========
const originalShowSection = window.showSection;
window.showSection = function(sectionName) {
  if (originalShowSection) {
    originalShowSection(sectionName);
  }
  updateActiveSection(sectionName);
  
  // Close menu on mobile
  if (window.innerWidth <= 700) {
    closeSidebar();
  }
  
  // Track usage
  trackSectionUsage(sectionName);
};

// ========== Usage Tracking ==========
function trackSectionUsage(section) {
  const usage = JSON.parse(localStorage.getItem('sectionUsage') || '{}');
  usage[section] = (usage[section] || 0) + 1;
  localStorage.setItem('sectionUsage', JSON.stringify(usage));
}

// ========== Helper Functions ==========
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('show');
  }
}

// ========== Export Functions for Global Access ==========
window.toggleMenuGroup = toggleMenuGroup;
window.togglePrivacyMode = togglePrivacyMode;
window.toggleDarkMode = toggleDarkMode;
window.changeLanguage = changeLanguage;
window.toggleMiniMode = toggleMiniMode;
window.toggleNotifications = toggleNotifications;
window.closeNotifications = closeNotifications;
window.markAllNotificationsRead = markAllNotificationsRead;
window.showWhatsNew = showWhatsNew;
window.closeWhatsNew = closeWhatsNew;
window.startOnboardingTour = startOnboardingTour;
window.nextTourStep = nextTourStep;
window.skipTour = skipTour;
window.toggleQuickActions = toggleQuickActions;
window.quickAddIncome = quickAddIncome;
window.quickAddExpense = quickAddExpense;
window.quickAddTransfer = quickAddTransfer;

console.log('✓ Menu enhancements loaded successfully!');
