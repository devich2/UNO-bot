import * as types from './actionTypes';

export function logIn(user) {
    return({ type: types.LOGGED_IN, user: user });
}

export function setGames(games) {
    return({ type: types.SET_GAMES, games: games });
}