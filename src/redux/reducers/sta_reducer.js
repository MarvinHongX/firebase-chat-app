import {
    SET_SEARCHING,
    SET_USER_SEARCH_KEYWORD,
    SET_SEARCH_KEYWORD,
    SET_SHOW_NAV,
    SET_SHOW_DETAIL,
    SET_SHOW_ADD_ROOM,
    SET_SHOW_ADD_PEOPLE,
    SET_SHOW_LEAVE_ROOM,
    SET_GO_TO_END,
} from '../actions/types'

const initialStaState = {
    searching: false,
    userSearchKeyword: {value:'', loading: false},
    searchKeyword: {value:'', loading: false},
    showNav: false,
    showDetail: false,
    showAddRoom: false,
    goToEnd: false,
}

export default function (state = initialStaState, action) {
    switch (action.type) {
        case SET_SEARCHING:
            return {
                ...state,
                searching: action.payload
            }
        case SET_SEARCH_KEYWORD:
            return {
                ...state,
                searchKeyword: action.payload
            }
        case SET_USER_SEARCH_KEYWORD:
            return {
                ...state,
                userSearchKeyword: action.payload
            }
        case SET_SHOW_NAV:
            return {
                ...state,
                showNav: action.payload
            }
        case SET_SHOW_DETAIL:
            return {
                ...state,
                showDetail: action.payload
            }    
        case SET_SHOW_ADD_ROOM:
            return {
                ...state,
                showAddRoom: action.payload
            }
        case SET_SHOW_ADD_PEOPLE:
            return {
                ...state,
                showAddPeople: action.payload
            }
        case SET_SHOW_LEAVE_ROOM:
            return {
                ...state,
                showLeaveRoom: action.payload
            }
        case SET_GO_TO_END:
            return {
                ...state,
                goToEnd: action.payload
            }
        default:
            return state
    }
}