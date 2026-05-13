const themeToggleButton = document.getElementById('theme-toggle-button');
const loginButton = document.getElementById("loginBt");

const emailInput = document.getElementById('input_mail');
const passwordInput = document.getElementById('input_pass');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

const API_BASE = 'http://localhost:5291/api/auth';

const adminID = '733-1o4';

// Функция для проверки валидности email и ключа через API
async function isValid(email, licenseKey) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                licenseKey: licenseKey
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка сети');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        return { 
            success: false, 
            message: 'Ошибка подключения к серверу' 
        };
    }
}

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

// Обновленная функция входа с реальным API
async function loginUser(email, licenseKey) {
    try {
        return {
            success: true,
            message: 'Correct'
        }
        const response = await isValid(email, licenseKey);
        
        if (response.success) {
            return { 
                success: true, 
                message: 'Success log in!',
                token: response.token,
                user: response.user
            };
            } else {
            return { 
                success: false, 
                message: response.message || 'Incorrect email or key!' 
            };
            }
    } catch (error) {
        console.error('Login error:', error);
        return { 
            success: false, 
            message: 'Connection error. Please try again.' 
        };
}
}

// Обновленный обработчик входа
loginButton.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const licenseKey = passwordInput.value.trim();
    
    hideMessages();

    // Валидация email
    if (!validateEmail(email)) {
        showError('Please, enter the correct e-mail.');
        return;
    }

    // Валидация длины ключа
    if (licenseKey.length < 1) {
        showError('Please enter your license key.');
        return;
    }

    // Показываем индикатор загрузки
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    try {
        const response = await loginUser(email, licenseKey);
        
        if (response.success) {
            showSuccess(response.message);
            
            // Сохраняем данные в localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('accessKey', licenseKey);
            
            // Сохраняем информацию о пользователе
            if (response.user) {
                localStorage.setItem('userId', response.user.id);
                localStorage.setItem('userEmail', response.user.email);
                localStorage.setItem('userName', response.user.name || 'User');
                localStorage.setItem('userRole', response.user.role);
                
                // Сохраняем часть email для отображения (последние 6 символов)
                const mailSecret = email.slice(-6);
                localStorage.setItem('mail', mailSecret);
                localStorage.setItem('mailC', email.length);
            }
            
                localStorage.setItem('id', adminID);

            // Перенаправляем на главную страницу после задержки
            setTimeout(() => {
                window.location.href = 'index.html#home';
            }, 1000);
        } else {
            showError(response.message);
        }
    } catch (error) {
        console.error('Login handler error:', error);
        showError('An unexpected error occurred. Please try again.');
    } finally {
        // Восстанавливаем кнопку
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

// Функция для проверки авторизации
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.success;
        } else {
            // Токен невалидный
            localStorage.removeItem('authToken');
            return false;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Обработчики для клавиши Enter
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginButton.click();
    }
});

// Функции для темы (остаются без изменений)
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

// Обработчики событий загрузки страницы
window.addEventListener("load", async (event) => {
  console.log("page is fully loaded - login");
    
    const token = localStorage.getItem('authToken');
    if (token) {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
            console.log("User is authenticated, redirecting...");
        window.location.href = 'index.html#home';
        }
    }
});

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

// Дополнительная функция для выхода
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessKey');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('mail');
    localStorage.removeItem('mailC');
    localStorage.removeItem('id');
    
    window.location.href = 'login.html';
}

// Экспорт функций для использования в других файлах (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loginUser, checkAuth, logout };
}