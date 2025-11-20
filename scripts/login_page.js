const themeToggleButton = document.getElementById('theme-toggle-button');
const loginButton = document.getElementById("loginBt");

const emailInput = document.getElementById('input_mail');
const passwordInput = document.getElementById('input_pass');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

const adminID = '733-1o4';

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function showError(message) {
     errorMessage.textContent = message;
     errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}
function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}
function loginUser(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulated authentication logic

            // Admin login
            if (email === 'admin@admin.com' && password === '5O7k-0154-9o9o-8g86') {
                resolve({ success: true, message: 'Success log in!' });
            } else {
                resolve({ success: false, message: 'Incorrect email or key!' });
            }
        }, 1500);
    });
}
loginButton.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    hideMessages();
    if (!validateEmail(email)) {
        showError('Please, enter the correct e-mail.');
        return;
    }
    if (password.length < 18) {
        showError('Key must be more than 18 symbols.');
        return;
    }
    loginUser(email, password).then((response) => {
        if (response.success) {
            showSuccess(response.message);
            // Redirect to index.html#home after a short delay so user can see the success message
            setTimeout(() => {
                localStorage.setItem('accessKey', password);
                let mailSecret = email.substring(email.length, 6);
                localStorage.setItem('mail', mailSecret);
                localStorage.setItem('mailC', email.length);
                localStorage.setItem('id', adminID);
                window.location.href = 'index.html#home';
            }, 1000);
        } else {
            showError(response.message);
        }
    });
});




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

window.addEventListener('DOMContentLoaded', () => {
    const st = localStorage.getItem('theme') || 'white';
    changeTheme(st);
    const themeSelect = document.querySelector('.theme-select');
    if (themeSelect) {
        themeSelect.value = st;
    }
});
themeToggleButton.addEventListener('click', () => {
    toggleTheme();
});