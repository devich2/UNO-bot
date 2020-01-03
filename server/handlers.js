const game_service = require('./game_service')
const websocket_service = require('./websocket_service')
const cards_service = require('./cards_service')

const handlers = 
{
    //#Must be called on opening client web-socket to identify connection on server  (front, telegram)
    'SAVE_CONNECTION': (data, conn)=> 
    {
        if (data.admin) websocket_service.add_admin(conn);
        else websocket_service.save_conn(data, conn);
    },
    //#Inner handler for storing unidentified server conn
    'PUSH_CONNECTION': (conn)=> websocket_service.push_conn(conn)
    ,
    //#Inner handler for deleting server conn                                        
    'DELETE_CONNECTION': (conn)=> websocket_service.del_conn(conn)
    ,
    //#Handler for creating game                                                     (front, telegram)                                
    'CREATE_GAME': (data, conn)=> game_service.create_game(data, conn)                 
    ,
    //#Handler for starting game: setting initial player cards, last_card            (front, telegram)   
    'START_GAME': (data, conn)=> game_service.start_game(data, conn)                 
    , 
    //#Handler for getting game by id                                                (telegram, front can use it)
    'GET_GAME': (data, conn)=> game_service.get_game(data,conn)
    ,
    //#Admin handler - currently not used
    'DELETE_GAME': (data, conn)=> game_service.delete_game(data,conn)
    ,
    //#Handler for continuing game                                                   (front)
    'CONTINUE_GAME': (data,conn)=> game_service.continue_game(data,conn)
    ,
    /*#Handler for finding games, passed parameter - letter/word (username of creator)
    Example: parameter : dev => games, whose username of creator starts with "dev" : [devich2,devich,devsd,dev,dev**,developer]
    Mainly for FRONT
   */
    'FIND_GAMES': (data, conn)=> game_service.find_available_games(data, conn)    
    ,
    //#Handler for finding joined games of user, passed parameter - telegram id       (front)         
    'FIND_JOINED_GAMES': (data,conn)=> game_service.find_joined_games(data, conn)
    ,
    //#Handler for joining to game by id                                              (front, telegram)
    'ADD_PLAYER': (data, conn)=> game_service.add_player(data, conn)
    ,
    //#Handler for deleting player from game (for example, player left the game )     (front, telegram)
    'DELETE_PLAYER': (data, conn)=> game_service.delete_player(data, conn)
    ,
    //#Call this handler, when player decides to challenge (call bluff) another player    (front, telegram)
    'CALL_BLUFF': (data, conn)=> cards_service.call_bluff(data,conn)
    ,
    //#Handler for putting card on Discard Pile                                         (front, telegram)
    'PUT_CARD': (data, conn)=> cards_service.put_card(data,conn)
    ,
    //#Call this, when player decides to pass                                          (front, telegram)
    'PASS': (data, conn)=> cards_service.pass(data,true,conn) 
    ,
    /*#Handler for setting color of current card (call this, when player put COLOR(*wild*) card
     and you got response from server with command to choose the color )                  (front, telegram)
     */
    'SET_COLOR': (data, conn)=> cards_service.set_color(data,conn)
    ,
    //#Handler to get cards by player id                                                  (telegram)
    'GET_CARDS': (data, conn)=> cards_service.get_cards(data,conn)
    ,
    //#Handler to get one card (prepare pass)                                         (front, telegram) 
    'GET_CARD': (data, conn)=> cards_service.pass(data, false, conn)
    ,
}
module.exports = handlers;