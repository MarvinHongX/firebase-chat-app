import {
    SET_CURRENT_ROOM
} from '../actions/types'

const initialRoomState = {
    currentRoom: null
}

export default function (state = initialRoomState, action) {
    switch (action.type) {
        case SET_CURRENT_ROOM:
            return {
                ...state,
                currentRoom: action.payload
            }
        default:
            return state
    }
}