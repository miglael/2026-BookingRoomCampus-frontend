// TOKEN MANAGEMENT

// Simpan token ke localStorage
function saveToken(token) {
    localStorage.setItem("token", token);
}

// Ambil token
function getToken() {
    return localStorage.getItem("token");
}

// Hapus token (logout)
function logout() {
    localStorage.removeItem("token");
    window.location.href = "../pages/login.html";
}


// JWT DECODER

// Decode JWT (tanpa library)
function parseJwt(token) {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}


// AUTH CHECK

// Cek apakah sudah login
function isLoggedIn() {
    return !!getToken();
}

// Ambil role dari token
function getUserRole() {
    const token = getToken();
    if (!token) return null;

    const decoded = parseJwt(token);

    // Role kamu tersimpan di claim ini
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
}

// Ambil email dari token
function getUserEmail() {
    const token = getToken();
    if (!token) return null;

    const decoded = parseJwt(token);

    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
}


// PAGE PROTECTION

// Wajib login
function requireLogin() {
    if (!isLoggedIn()) {
        alert("Silakan login terlebih dahulu");
        window.location.href = "../pages/login.html";
    }
}

// Wajib admin
function requireAdmin() {
    requireLogin();

    if (getUserRole() !== "Admin") {
        alert("Akses hanya untuk Admin");
        window.location.href = "../pages/dashboard.html";
    }
}
