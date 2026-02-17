// // Base URL backend
// const BASE_URL = "http://localhost:5152/api";

// // Helper: log and surface backend errors
// async function handleErrorResponse(response) {
//     const text = await response.text();
//     const err = new Error(`Request failed (${response.status} ${response.statusText}): ${text}`);
//     err.status = response.status;
//     err.responseText = text;
//     throw err;
// }

// // ========================
// // AUTH
// // ========================

// // Login
// async function login(email, password) {
//     const url = `${BASE_URL}/auth/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
//     console.log("[api] POST", url);
//     const response = await fetch(url, {
//         method: "POST",
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
//     return await response.json(); // { token: "..." }
// }

// // Register (fix: must include fullName if backend expects it)
// async function register(fullName, email, password) {
//     const url = `${BASE_URL}/auth/register?fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
//     console.log("[api] POST", url);
//     const response = await fetch(url, {
//         method: "POST",
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
//     return await response.text();
// }

// // ========================
// // BOOKINGS (Butuh Token)
// // ========================

// // Helper ambil token
// function getAuthHeader() {
//     const token = localStorage.getItem("token");
//     const headers = {
//         "Content-Type": "application/json"
//     };
//     if (token) {
//         headers["Authorization"] = "Bearer " + token;
//     }
//     return headers;
// }

// // GET semua booking (dengan optional filter)
// async function getBookings(queryParams = "") {
//     const url = `${BASE_URL}/bookings${queryParams}`;
//     console.log("[api] GET", url);
//     const response = await fetch(url, {
//         method: "GET",
//         headers: getAuthHeader(),
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
//     return await response.json();
// }

// // CREATE booking (User only)
// async function createBooking(bookingData) {
//     const url = `${BASE_URL}/bookings`;
//     console.log("[api] POST", url, bookingData);
//     const response = await fetch(url, {
//         method: "POST",
//         headers: getAuthHeader(),
//         body: JSON.stringify(bookingData),
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
//     return await response.json();
// }

// // UPDATE STATUS (Admin only)
// async function updateBookingStatus(id, status) {
//     const url = `${BASE_URL}/bookings/${id}/status`;
//     console.log("[api] PATCH", url, status);
//     const response = await fetch(url, {
//         method: "PATCH",
//         headers: getAuthHeader(),
//         body: JSON.stringify({ status }),
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
// }

// // DELETE booking (Admin only)
// async function deleteBooking(id) {
//     const url = `${BASE_URL}/bookings/${id}`;
//     console.log("[api] DELETE", url);
//     const response = await fetch(url, {
//         method: "DELETE",
//         headers: getAuthHeader(),
//         mode: 'cors'
//     });
//     if (!response.ok) {
//         await handleErrorResponse(response);
//     }
// }

// // Ambil token
// function getToken() {
//     return localStorage.getItem("token");
// }

// // Cek apakah sudah login
// function isLoggedIn() {
//     return !!getToken();
// }

// // Logout
// function logout() {
//     localStorage.removeItem("token");
//     window.location.href = "login.html";
// }

// =======================================
// CONFIG
// =======================================

const BASE_URL = "http://localhost:5152/api";


// =======================================
// TOKEN MANAGEMENT
// =======================================

function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../pages/login.html";
}


// =======================================
// HELPER REQUEST
// =======================================

function getAuthHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

async function handleResponse(response) {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Terjadi kesalahan server");
    }

    // kalau kosong jangan parse json
    if (response.status === 204) return null;

    return await response.json();
}


// =======================================
// AUTH API
// =======================================

// LOGIN
async function login(email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST"
        }
    );

    const data = await handleResponse(response);

    saveToken(data.token);

    return data;
}


// REGISTER
async function register(email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST"
        }
    );

    return await handleResponse(response);
}


// =======================================
// BOOKINGS API (BUTUH TOKEN)
// =======================================


// GET semua booking
async function getBookings() {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return await handleResponse(response);
}


// GET booking by id
async function getBookingById(id) {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return await handleResponse(response);
}


// CREATE booking
async function createBooking({
    namaPeminjam,
    ruangan,
    tanggal,
    jamMulai,
    jamSelesai
}) {
    const booking = {
        namaPeminjam,
        ruangan,
        tanggal,
        jamMulai,
        jamSelesai,
        status: "Menunggu"
    };

    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(booking)
    });

    return await handleResponse(response);
}


// UPDATE booking (admin)
async function updateBooking(id, booking) {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(booking)
    });

    return await handleResponse(response);
}


// UPDATE STATUS (admin)
async function updateBookingStatus(id, status) {
    const response = await fetch(`${BASE_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(status)
    });

    return await handleResponse(response);
}


// DELETE booking (admin)
async function deleteBooking(id) {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return await handleResponse(response);
}
