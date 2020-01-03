import * as types from './actionTypes';

export function newGameChosen() {
    return({ type: types.NEW_GAME_CHOSEN })
}

export function continueChosen() {
    return({ type: types.LOAD_GAME_CHOSEN })
}

export function joinChosen() {
    return({ type: types.JOIN_CHOSEN })
}

export function newGameClose() {
    return({ type: types.NEW_GAME_CLOSE })
}

export function loadGameClose() {
    return({ type: types.LOAD_GAME_CLOSE })
}

export function joinClose() {
    return({ type: types.JOIN_CLOSE })
}