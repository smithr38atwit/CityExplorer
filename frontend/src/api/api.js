// const api = "http://127.0.0.1:8000"
const api = "https://10.17.40.38:8000";


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


export async function login(email, password) {
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