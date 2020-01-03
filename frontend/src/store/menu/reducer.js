import Immutable from 'seamless-immutable';
import * as types from './actionTypes';


const initialState = Immutable({
    NewGame: false,
    Join: false,
    LoadGame: false,
    CurrentGame: false,
    Menu: false
});

export default function reduce(state = initialState, action = {}) {

    switch (action.type) {
        case types.NEW_GAME_CHOSEN: {
            return state.merge({
                NewGame: true
            });
        }
        case types.JOIN_CHOSEN: {
            return state.merge({
                Join: true
            });
        }
        case types.LOAD_GAME_CHOSEN: {
            return state.merge({
                LoadGame: true
            });
        }
        case types.NEW_GAME_CLOSE: {
            return state.merge({
                NewGame: false
            });
        }
        case types.JOIN_CLOSE: {
            return state.merge({
                Join: false
            });
        }
        case types.LOAD_GAME_CLOSE: {
            return state.merge({
                LoadGame: false
            });
        }
        default:
            return state;
    }
}

//selectors
export function getNewGame(state) {
    return state.menu.NewGame;
}

export function getJoin(state) {
    return state.menu.Join;
}

export function getLoadGame(state) {
    return state.menu.LoadGame;
}