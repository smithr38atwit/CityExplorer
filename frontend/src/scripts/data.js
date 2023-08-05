function friendModel(user, pins) {
    return {
        username: user,
        pins: pins
    }
}

export function authModel(id, user, email, pins) {
    return {
        id: id,
        username: user,
        email: email,
        pins: pins,
        // TODO friends: 
    }
}

export function pinModel(name, address, lng, lat, dateLogged, thumbsUp, thumbsDown, owner) {
    return {
        name: name,
        address: address,
        longitude: lng,
        latitude: lat,
        date_logged: dateLogged,
        thumbs_up: thumbsUp,
        thumbs_down: thumbsDown,
        owner_name: owner
    }
}