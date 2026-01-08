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

// --- 🌓 DARK MODE SYNC ---
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// --- 🔐 PRIVACY LOCK ---
function checkLock() {
    const pin = localStorage.getItem('neorah_pin');
    // SessionStorage prevents the prompt from appearing on every page click
    const isAuthenticated = sessionStorage.getItem('neorah_auth');

    if (pin && !isAuthenticated) {
        const entry = prompt("🔒 NEORAH OS: Enter 4-digit Privacy PIN to unlock:");
        if (entry === pin) {
            sessionStorage.setItem('neorah_auth', 'true');
        } else {
            document.body.innerHTML = `
                <div style="background:#020617; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                    <h1 style="font-size:3.5rem; font-weight:900; letter-spacing:-2px; margin:0;">LOCKED</h1>
                    <p style="color:#64748b; font-weight:bold; text-transform:uppercase; font-size:12px; letter-spacing:4px; margin-top:10px;">Biometric or PIN Required</p>
                    <button onclick="location.reload()" style="margin-top:30px; background:#ef4444; color:white; border:none; padding:15px 30px; border-radius:12px; font-weight:900; text-transform:uppercase; cursor:pointer; letter-spacing:1px;">Retry Unlock</button>
                </div>`;
        }
    }
}

function toggleLock() {
    const cur = localStorage.getItem('neorah_pin');
    if (cur) { 
        if(confirm("Remove security PIN and unlock app for everyone?")) { 
            localStorage.removeItem('neorah_pin'); 
            sessionStorage.removeItem('neorah_auth');
            location.reload(); 
        }
    } else { 
        const p = prompt("Create a new 4-digit Privacy PIN:"); 
        if (p && p.length === 4 && !isNaN(p)) { 
            localStorage.setItem('neorah_pin', p); 
            sessionStorage.setItem('neorah_auth', 'true');
            alert("✅ Security PIN Enabled!"); 
        } else {
            alert("❌ Invalid PIN. Must be exactly 4 digits.");
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
    } catch (e) {
        alert("Export failed. Ensure browser permits downloads.");
    }
}

// --- 🛠️ SYSTEM INITIALIZATION ---
(function initSystem() {
    // 1. Apply Color Theme
    applyTheme(localStorage.getItem('neorah_theme') || 'crimson');

    // 2. Apply Dark/Light Mode
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
    
    // 3. Run Privacy Check
    checkLock();

    // 4. Smart Navigation Highlighting (for desktop & mobile)
    window.addEventListener('DOMContentLoaded', () => {
        const path = window.location.pathname.split("/").pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a, nav a, .mobile-nav a');
        
        links.forEach(link => {
            if (link.getAttribute('href') === path) {
                // Desktop Style
                link.classList.add('text-custom-accent', 'font-bold', 'bg-white/5', 'rounded-xl');
                // Mobile Style
                if (link.parentElement.classList.contains('mobile-nav') || link.classList.contains('font-black')) {
                    link.style.color = 'var(--accent)';
                    link.style.background = 'rgba(255,255,255,0.1)';
                }
            }
        });
    });
})();

