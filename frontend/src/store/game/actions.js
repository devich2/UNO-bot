import * as types from './actionTypes';

export function joinGame(gameChosen) {
    return({ type: types.JOIN_GAME, game: gameChosen});
}
export function startGame(gameChosen) {
    console.log(gameChosen)
    return({ type: types.START_GAME, game: gameChosen});
}