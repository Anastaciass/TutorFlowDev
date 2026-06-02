const API_BASE_URL = 'http://localhost:8080';

export async function createLessonSlot(accessToken, slotData) {
    const response = await fetch(`${API_BASE_URL}/api/tutor/slots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(slotData),
    });

    if (!response.ok) {
        throw new Error('Failed to create lesson slot');
    }

    return await response.json();
}
export async function getTutorSlots(accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/tutor/slots`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load tutor slots');
    }

    return await response.json();
}
export async function getAvailableSlots(accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/student/slots`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load available slots');
    }

    return await response.json();
}
export async function confirmLessonSlot(accessToken, slotId) {
    const response = await fetch(`${API_BASE_URL}/api/tutor/slots/${slotId}/confirm`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to confirm lesson slot');
    }

    return await response.json();
}

export async function declineLessonSlot(accessToken, slotId) {
    const response = await fetch(`${API_BASE_URL}/api/tutor/slots/${slotId}/decline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to decline lesson slot');
    }

    return await response.json();
}
export async function bookLessonSlot(accessToken, slotId) {
    const response = await fetch(`${API_BASE_URL}/api/student/slots/${slotId}/book`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to book lesson slot');
    }

    return await response.json();
}
export async function getStudentBookings(accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/student/bookings`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to load student bookings');
    }

    return await response.json();
}