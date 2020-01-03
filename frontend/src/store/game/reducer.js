import * as types from "../game/actionTypes";
import Immutable from "seamless-immutable";

const initialState = Immutable({
    CurrentGame: null
});

export default function reduce(state = initialState, action = {}) {

    switch (action.type) {
        case types.JOIN_GAME: {
            console.log('Action',action.game);
            return state.merge({
            CurrentGame: action.game
            });
        }
        case types.START_GAME: {
            console.log('Action',action.game);
            return state.merge({
            CurrentGame: action.game
            });
        }
        default:
            return state;
    }
}
//selectors
export function getGame(state) {
    //console.log('state',state.game.game.CurrentGame);
    return state.CurrentGame ? state.CurrentGame : null;
}
export function getNowPlayer(state) {
    return state.CurrentGame.game ? state.CurrentGame.game.players[state.CurrentGame.game.now || 0] : null;
}