const API_URL = "http://localhost:5000/api/auth";

export async function register(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
}

export async function login(userData) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
}