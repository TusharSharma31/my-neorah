// --- 🎨 THEME ENGINE ---
const themes = {
    crimson: { primary: '#7f1d1d', accent: '#ef4444', bg: '#0f172a' },
    emerald: { primary: '#064e3b', accent: '#10b981', bg: '#022c22' },
    midnight: { primary: '#1e3a8a', accent: '#3b82f6', bg: '#171717' },
    gold: { primary: '#78350f', accent: '#f59e0b', bg: '#1c1917' }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.crimson;
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--sidebar-bg', theme.bg);
    localStorage.setItem('neorah_theme', themeName);
}

// --- 🍔 HAMBURGER MENU TOGGLE ---
function toggleHamburger() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// --- 🌓 DARK MODE SYNC ---
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// --- 🔐 PRIVACY LOCK ---
function checkLock() {
    const pin = localStorage.getItem('neorah_pin');
    const isAuthenticated = sessionStorage.getItem('neorah_auth');
    if (pin && !isAuthenticated) {
        const entry = prompt("🔒 NEORAH OS: Enter 4-digit Privacy PIN to unlock:");
        if (entry === pin) {
            sessionStorage.setItem('neorah_auth', 'true');
        } else {
            document.body.innerHTML = `<div style="background:#020617; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;"><h1>LOCKED</h1><button onclick="location.reload()">Retry Unlock</button></div>`;
        }
    }
}

// --- 📥 BACKUP & RESTORE ---
function exportData() {
    try {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `Neorah_OS_Backup_${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (e) { alert("Export failed."); }
}

(function initSystem() {
    applyTheme(localStorage.getItem('neorah_theme') || 'crimson');
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
    checkLock();
    window.addEventListener('DOMContentLoaded', () => {
        const path = window.location.pathname.split("/").pop() || 'index.html';
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('text-custom-accent', 'font-bold', 'bg-white/5', 'rounded-xl', 'border-l-4', 'border-custom-accent');
            }
        });
    });
})();
