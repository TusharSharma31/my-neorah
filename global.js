// --- 🎨 THEME ENGINE ---
const themes = {
    crimson: { primary: '#7f1d1d', accent: '#ef4444', bg: '#0f172a' },
    emerald: { primary: '#064e3b', accent: '#10b981', bg: '#022c22' },
    midnight: { primary: '#1e3a8a', accent: '#3b82f6', bg: '#171717' },
    gold: { primary: '#78350f', accent: '#f59e0b', bg: '#1c1917' }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.crimson;
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--sidebar-bg', theme.bg);
    localStorage.setItem('neorah_theme', themeName);
}

// --- 🔐 PRIVACY LOCK ---
function checkLock() {
    const pin = localStorage.getItem('neorah_pin');
    if (pin) {
        const entry = prompt("Enter 4-digit Privacy PIN:");
        if (entry !== pin) {
            document.body.innerHTML = "<div style='background:#000; color:white; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;'><h1>Locked. Access Denied.</h1></div>";
        }
    }
}

function toggleLock() {
    const cur = localStorage.getItem('neorah_pin');
    if (cur) { 
        if(confirm("Remove PIN lock?")) { localStorage.removeItem('neorah_pin'); location.reload(); }
    } else { 
        const p = prompt("Set a new 4-digit PIN:"); 
        if (p && p.length === 4) { localStorage.setItem('neorah_pin', p); alert("PIN Set!"); } 
    }
}

// --- 📥 BACKUP & RESTORE ---
function exportData() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Neorah_Backup_2026.json`;
    a.click();
}

function importData(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data = JSON.parse(evt.target.result);
            if(confirm("Restore this backup? Current data will be overwritten.")) {
                localStorage.clear();
                Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
                location.reload();
            }
        } catch(err) { alert("Invalid file."); }
    };
    reader.readAsText(file);
}

// Auto-run on load
(function() {
    applyTheme(localStorage.getItem('neorah_theme') || 'crimson');
    checkLock();
})();