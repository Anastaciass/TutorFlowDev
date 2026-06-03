const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data;
}

export async function loginUser(userData) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
}

export async function getCurrentUser(accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
}

export async function logoutUser(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
    }

    return data;
} 