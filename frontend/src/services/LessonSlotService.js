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