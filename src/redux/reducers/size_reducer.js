import {
    SET_WINDOW_SIZE,
    SET_VISUAL_SIZE
} from '../actions/types'

const initialSizeState = {
    windowSize: null,
    visualSize: null
}

export default function (state = initialSizeState, action) {
    switch (action.type) {
        case SET_WINDOW_SIZE:
            return {
                ...state,
                windowSize: action.payload
            }
        case SET_VISUAL_SIZE:
            return {
                ...state,
                visualSize: action.payload
            }
        default:
            return state
    }
}