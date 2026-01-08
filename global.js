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

// --- 🔐 PRIVACY LOCK ---
function checkLock() {
    const pin = localStorage.getItem('neorah_pin');
    // Use sessionStorage to avoid re-prompting on every page change
    const isAuthenticated = sessionStorage.getItem('neorah_auth');

    if (pin && !isAuthenticated) {
        const entry = prompt("🔒 NEORAH OS: Enter 4-digit Privacy PIN to unlock:");
        if (entry === pin) {
            sessionStorage.setItem('neorah_auth', 'true');
        } else {
            document.body.innerHTML = `
                <div style="background:#020617; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
                    <h1 style="font-size:3rem; font-weight:900; letter-spacing:-2px;">LOCKED</h1>
                    <p style="color:#64748b; font-weight:bold; text-transform:uppercase; font-size:12px; letter-spacing:4px;">Access Denied / Invalid PIN</p>
                    <button onclick="location.reload()" style="margin-top:20px; background:#ef4444; color:white; border:none; padding:10px 20px; border-radius:10px; font-weight:bold; cursor:pointer;">Retry Login</button>
                </div>`;
        }
    }
}

function toggleLock() {
    const cur = localStorage.getItem('neorah_pin');
    if (cur) { 
        if(confirm("Are you sure you want to remove the security PIN?")) { 
            localStorage.removeItem('neorah_pin'); 
            sessionStorage.removeItem('neorah_auth');
            location.reload(); 
        }
    } else { 
        const p = prompt("Set a new 4-digit Privacy PIN:"); 
        if (p && p.length === 4 && !isNaN(p)) { 
            localStorage.setItem('neorah_pin', p); 
            sessionStorage.setItem('neorah_auth', 'true');
            alert("✅ Security PIN Enabled!"); 
        } else {
            alert("❌ Invalid PIN. Must be 4 digits.");
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
        alert("Export failed. LocalStorage might be empty or corrupted.");
    }
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data = JSON.parse(evt.target.result);
            if(confirm("⚠️ CRITICAL: This will overwrite all current data. Proceed with restoration?")) {
                localStorage.clear();
                Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
                alert("Restoration Complete. System Rebooting...");
                location.reload();
            }
        } catch(err) { 
            alert("❌ Error: The file is not a valid Neorah backup."); 
        }
    };
    reader.readAsText(file);
}

// --- 🛠️ SYSTEM INITIALIZATION ---
(function initSystem() {
    // 1. Apply Theme
    applyTheme(localStorage.getItem('neorah_theme') || 'crimson');
    
    // 2. Run Privacy Check
    checkLock();

    // 3. Highlight active nav item
    window.addEventListener('DOMContentLoaded', () => {
        const path = window.location.pathname.split("/").pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a, nav a');
        links.forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('text-custom-accent', 'font-bold', 'bg-white/5', 'rounded-xl');
            }
        });
    });
})();
