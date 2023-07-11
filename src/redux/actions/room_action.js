import {
    SET_CURRENT_ROOM
} from './types'

export function setCurrentRoom(currentRoom) {
    return {
        type: SET_CURRENT_ROOM,
        payload: currentRoom
    }
}
