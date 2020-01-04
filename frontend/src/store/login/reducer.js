import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const letters = ['a','b','c','d','f','g','r','y','u','1','2','3','4','5','6','40','544'];
 const initialState = Immutable({
    Logged: true,
    User: {id: '12333340', first_name: 'dolboeb', last_name: 'petia', username: 'hitr3cswhfssdsd5544445', available_games: []}//undefined
});

export default function reduce(state = initialState, action = {}) {

    switch (action.type) {
        case types.LOGGED_IN: {

            let user = {
                id : action.user.id,
                first_name : action.user.first_name,
                last_name : action.user.last_name,
                username : action.user.username,
                photo_url :  action.user.photo_url,
                available_games: []
            };

            return state.merge({
                Logged: true,
                User: user
            });
        }
        case types.SET_GAMES: {
            let user = {
                id: state.User.id,
                first_name: state.User.first_name,
                last_name: state.User.last_name,
                username: state.User.username,
                available_games: action.games
            };
            console.log('GAmes', action);
            return state.merge({
                User: user
            });
        }
        default:{
            return state;
        }

    }
}

//selectors

export  function isLogged(state) {
    return state.login.Logged;
}

export function getUser(state) {
    console.log('OUR STATE', state.login.User);
    return state.login.User ? state.login.User: null;
}