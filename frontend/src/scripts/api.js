const api = "http://127.0.0.1:8000"


export async function createAccount(username, email, password) {
    const url = `${api}/users/`;
    const body = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    })
    console.debug(`POST: ${url}\n`, body);
    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        });
    } catch (error) {
        console.debug("FETCH ERROR: ", error)
    }
    return response;
}


export async function login(email, password) {

}