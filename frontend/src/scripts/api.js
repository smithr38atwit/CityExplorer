const api = "http://127.0.0.1:8000"


export function createAccount(username, email, password) {
    const url = `${api}/register`;
    const body = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    })
    console.debug(`POST: ${url}\n`, body);
    const response = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    });
    return response;
}


export function login(email, password) {
    const url = `${api}/login`;
    const body = JSON.stringify({ email, password });
    console.debug(`POST: ${url}\n`, body);
    const response = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    });
    return response;
}


export function createPin(pin, id) {
    const url = `${api}/create_pin`;
    const body = JSON.stringify({
        "title": pin.name,
        "description": pin.address,
        "latitude": pin.latitude,
        "longitude": pin.longitude,
        "owner_id": id
    });
    console.debug(`POST: ${url}\n`, body);
    const response = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    });
    return response;
}