import {
    SET_SEARCHING,
    SET_SEARCH_KEYWORD,
    SET_USER_SEARCH_KEYWORD,
    SET_SHOW_NAV,
    SET_SHOW_DETAIL,
    SET_SHOW_ADD_ROOM,
    SET_SHOW_ADD_PEOPLE,
    SET_SHOW_LEAVE_ROOM,
    SET_GO_TO_END,
} from './types'

export function setSearching(searching) {
    return {
        type: SET_SEARCHING,
        payload: searching
    }
}

export function setSearchKeyword(searchKeyword) {
    return {
        type: SET_SEARCH_KEYWORD,
        payload: searchKeyword
    }
}

export function setUserSearchKeyword(userSearchKeyword) {
    return {
        type: SET_USER_SEARCH_KEYWORD,
        payload: userSearchKeyword
    }
}

export function setShowNav(showNav) {
    return {
        type: SET_SHOW_NAV,
        payload: showNav
    }
}
export function setShowDetail(showDetail) {
    return {
        type: SET_SHOW_DETAIL,
        payload: showDetail
    }
}
export function setShowAddRoom(showAddRoom) {
    return {
        type: SET_SHOW_ADD_ROOM,
        payload: showAddRoom
    }
}

export function setShowAddPeople(showAddPeople) {
    return {
        type: SET_SHOW_ADD_PEOPLE,
        payload: showAddPeople
    }
}

export function setShowLeaveRoom(showLeaveRoom) {
    return {
        type: SET_SHOW_LEAVE_ROOM,
        payload: showLeaveRoom
    }
}

export function setGoToEnd(goToEnd) {
    return {
        type: SET_GO_TO_END,
        payload: goToEnd
    }
}