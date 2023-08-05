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
        "name": pin.name,
        "address": pin.address,
        "longitude": pin.longitude,
        "latitude": pin.latitude,
        "date_logged": pin.date_logged,
        "thumbs_up": pin.thumbs_up,
        "thumbs_down": pin.thumbs_down,
        "feature_id": pin.feature_id,
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