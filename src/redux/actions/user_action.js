import {
    SET_USER,
    CLEAR_USER,
    CLEAR_ONLINE_USER,
    SET_PHOTO_URL,
    SET_DISPLAY_NAME
} from './types'

export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function clearUser() {
    return {
        type: CLEAR_USER
    }
}

export function clearOnlineUser() {
    return {
        type: CLEAR_ONLINE_USER
    }
}


export function setPhotoURL(photoURL) {
    return {
        type: SET_PHOTO_URL,
        payload: photoURL
    }
}

export function setDisplayName(displayName) {
    return {
        type: SET_DISPLAY_NAME,
        payload: displayName
    }
}


