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

    if (response.status === 204) return null;

    const text = await response.text();

    try {
        return JSON.parse(text); // kalau JSON → parse
    } catch {
        return text; // kalau string biasa → langsung return
    }
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
async function register(fullName, email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/register?fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
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
