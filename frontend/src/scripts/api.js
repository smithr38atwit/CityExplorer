const api = "http://127.0.0.1:8000"


export async function createAccount(name, email, password) {
    const url = `${api}/users/`;
    const body = JSON.stringify({
        "fullname": name,
        "email": email,
        "password": password
    })
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    });
    console.debug(`POST: ${url}\n`, body);
    return response;
}
