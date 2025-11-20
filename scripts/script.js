function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        showSection('home');
    }
}
// Buttons
const themeToggleButton = document.getElementById('theme-toggle-button');
const currentKeyButton = document.getElementById("currentKey");
const currentEmailLabel = document.getElementById("currentEmail");
const currentIdLabel = document.getElementById("currentId");

function toggleTheme() {
    const themeLink = document.getElementById('theme-style');
    const currentTheme = themeLink.getAttribute('href');
    
    if (currentTheme.includes('white-theme.css')) {
        themeLink.setAttribute('href', 'styles/dark-theme.css');
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = '☀️';
    } else {
        themeLink.setAttribute('href', 'styles/white-theme.css');
        localStorage.setItem('theme', 'white');
        themeToggleButton.textContent = '🌙';
    }
}
function changeTheme(theme) {
    const tl = document.getElementById('theme-style');
    if (theme === 'dark') {
        tl.setAttribute('href', 'styles/dark-theme.css');
    } else {
        tl.setAttribute('href', 'styles/white-theme.css');
    }
    
    localStorage.setItem('theme', theme);
}
window.addEventListener("load", (event) => {
  console.log("page is fully loaded - main");
  const key = localStorage.getItem('accessKey') || 'none';
  const mailL = localStorage.getItem('mail') || 'none';
  const mailC = localStorage.getItem('mailC') || null;
  const id = localStorage.getItem('id') || null;

    if (key === 'none' || mailL === 'none' || id === null) {
        alert("Kay is not found!");
        window.location.href = 'login.html';
    }
    else {
        currentKeyButton.textContent = key;
        let s = '';
        for (let i = 0; i < mailC; i += 5) {
            s = s + '*';
            i++;
        }
        currentEmailLabel.textContent = "Email: " + s + mailL;
    }
});
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', () => {
        handleHashChange();
        const st = localStorage.getItem('theme') || 'white';
        changeTheme(st);
        const themeSelect = document.querySelector('.theme-select');
        if (themeSelect) {
            themeSelect.value = st;
        }
});


// Binds
currentKeyButton.addEventListener('click',() => {
    try {
        alert("Copied key!");
        navigator.clipboard.writeText(currentKeyButton.textContent);
    }
    catch (err) {
        alert("Failed to copy key!");
        console.error(err);
    }
});
themeToggleButton.addEventListener('click', () => {
    toggleTheme();
});