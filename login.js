function handleLogin(event) {
    event.preventDefault();
    const input = document.getElementById('password');
    const error = document.getElementById('loginError');
    const code = input.value.trim();
    const validCode = 'STUDIO2026';

    if (code === validCode) {
        localStorage.setItem('toolsAccess', 'true');
        window.location.href = 'tools.html';
        return true;
    }

    error.textContent = 'Incorrect access code. Please try again.';
    input.focus();
    return false;
}
