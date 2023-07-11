import {
    SET_WINDOW_SIZE,
    SET_VISUAL_SIZE
} from './types'

export function setWindowSize(windowSize) {
    return {
        type: SET_WINDOW_SIZE,
        payload: windowSize
    }
}

export function setVisualSize(visualSize) {
    return {
        type: SET_VISUAL_SIZE,
        payload: visualSize
    }
}