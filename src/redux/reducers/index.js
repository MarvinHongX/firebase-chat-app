import { combineReducers } from 'redux'
import sta from './sta_reducer'
import size from './size_reducer'
import user from './user_reducer'
import room from './room_reducer'

const rootReducer = combineReducers({
    sta,
    size,
    user, 
    room,
})

export default rootReducer