// Base URL backend
const BASE_URL = "http://localhost:5152/api";

// AUTH

// Login
async function login(email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Email atau password salah");
    }

    return await response.json(); // { token: "..." }
}

/// Register
async function register(fullName, email, password) {
    const response = await fetch(
        `${BASE_URL}/auth/register?fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return await response.text();
}



// BOOKINGS (Butuh Token)


// Helper ambil token
function getAuthHeader() {
    const token = localStorage.getItem("token");
    return {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };
}


// GET semua booking (dengan optional filter)
async function getBookings(queryParams = "") {
    const response = await fetch(`${BASE_URL}/bookings${queryParams}`, {
        method: "GET",
        headers: getAuthHeader()
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data booking");
    }

    return await response.json();
}


// CREATE booking (User only)
async function createBooking(bookingData) {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return await response.json();
}


// UPDATE STATUS (Admin only)
async function updateBookingStatus(id, status) {
    const response = await fetch(`${BASE_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(status) // kirim string, bukan object
    });

    if (!response.ok) {
        throw new Error("Gagal update status");
    }
}


// DELETE booking (Admin only)
async function deleteBooking(id) {
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: getAuthHeader()
    });

    if (!response.ok) {
        throw new Error("Gagal menghapus booking");
    }
}
