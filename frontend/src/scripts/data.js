// Function to define a standar model for user data
export function userModel(id, user, email, pins, friends) {
    return {
        id: id,
        username: user,
        email: email,
        pins: pins,
        friends: friends
    }
}

// Function to define a standard model for a pin
export function pinModel(name, address, lng, lat, dateLogged, thumbsUp, thumbsDown, feature) {
    return {
        name: name,
        address: address,
        longitude: lng,
        latitude: lat,
        date_logged: dateLogged,
        thumbs_up: thumbsUp,
        thumbs_down: thumbsDown,
        feature_id: feature
    }
}