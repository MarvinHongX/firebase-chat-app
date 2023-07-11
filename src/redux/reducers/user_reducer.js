import {
    SET_USER,
    CLEAR_USER,
    CLEAR_ONLINE_USER,
    SET_PHOTO_URL,
    SET_DISPLAY_NAME
} from '../actions/types'

const initialUserState = {
    currentUser: null,
    onlineUser: null,
    isLoading: true
}


export default function (state = initialUserState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                onlineUser: action.payload,
                isLoading: false
            }
        case CLEAR_USER:
            return {
                ...state,
                currentUser: null,
                isLoading: false
            }
        case CLEAR_ONLINE_USER:
            return {
                ...state,
                onlineUser: null,
                isLoading: false
            }
        case SET_PHOTO_URL:
            return {
                ...state,
                currentUser: { ...state.currentUser, photoURL: action.payload },
                isLoading: false
            }
        case SET_DISPLAY_NAME:
            return {
                ...state,
                currentUser: { ...state.currentUser, displayName: action.payload },
                isLoading: false
            }
        default:
            return state
    }
}