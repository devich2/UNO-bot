const game_service = require('./game_service')
const websocket_service = require('./websocket_service')
const cards_service = require('./cards_service')

const handlers = 
{
    'SAVE_CONNECTION': (data, conn)=> 
    {
        if (data.admin) websocket_service.add_admin(conn);
        else websocket_service.save_conn(data, conn);
    },
    'PUSH_CONNECTION': (conn)=> websocket_service.push_conn(conn)
    ,
    'DELETE_CONNECTION': (conn)=> websocket_service.del_conn(conn)
    ,

    'CREATE_GAME': (data, conn)=> game_service.create_game(data, conn)
    ,
    'START_GAME': (data, conn)=> game_service.start_game(data, conn)
    ,
    'GET_GAME': (data, conn)=> game_service.get_game(data,conn)
    ,
    'DELETE_GAME': (data, conn)=> game_service.delete_game(data,conn)
    ,
    'FIND_GAMES': (data, conn)=> game_service.find_games(data, conn)
    ,
    'ADD_PLAYER': (data, conn)=> game_service.add_player(data, conn)
    ,
    'DELETE_PLAYER': (data, conn)=> game_service.delete_player(data, conn)
    ,

    'PUT_CARD': (data, conn)=> cards_service.put_card(data)
    ,
    'PASS': (data, conn)=> cards_service.call_bluff(data,conn) 
    ,
    'SET_COLOR': (data, conn)=> cards_service.set_color(data,conn)
    ,
    'GET_CARDS': (data, conn)=> cards_service.get_cards(data, conn)
    ,
    'GET_CARD': (data, conn)=> cards_service.pass(data, false)
    ,

}
module.exports = handlers;