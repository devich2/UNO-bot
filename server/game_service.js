const Game = require("../logic/game");
const storage = require("../logic/db");
const broadcast = require("./websocket_service")

async function create_game(data, conn) {
  try {
    console.log('HERE')
    let game_created = await check_game_created(data), game;
    if (game_created) {
      console.log('ALREADY CREATED')
      conn.sendUTF(JSON.stringify(Object.assign(data, {
        type: 'GAME_ALREADY_STARTED'
      })))
    } else {
      console.log('Created game')
        game = new Game({
        id: data.game.id,
        creator: data.game.player.username,
        players: [data.game.player]
      });
      storage.save_game(game);

      broadcast.send({
        type: 'GAME_CREATED',
        id: game.id,
        players: game.players
      });
    }
  } catch (e) {
    broadcast.send({
      type: e.message || e,
      id: data.game.id
    });
  }

}
module.exports.create_game = create_game;

function send_hanging_actions(game, data, conn)
{ 
  let now_playing = data.game.player.username == game.now_player().username; 
  if(now_playing)
  {
    if(game.check_can_call_bluff() && game.ability)
    {
      conn.sendUTF(JSON.stringify(send_game('CAN_CALL_BLUFF', data,game)))
    }
    else if(game.check_can_change_color())
    {
      conn.sendUTF(JSON.stringify(send_game('CHANGE_COLOR', data,game)))
    }
    else if (game.drawn)
    {
      conn.sendUTF(JSON.stringify(send_game('PREPARE_PASS', data,game)))
    }
  }
 
}


async function add_player(data, conn) {
  try {
    console.log('DATA', data);
    let in_game = await check_in_game(data), content, game;
    if (in_game) {
      console.log('IN GAME',in_game)
      game = new Game(in_game)
      //console.log(game);
      conn.sendUTF(JSON.stringify(send_game('ALREADY_IN_GAME',data, game)));
      send_hanging_actions(game, data, conn)
    } else {
      content = await storage.load_game(data.game.id);
      game = new Game(content);
      game.add_player(data.game.player);
      storage.save_game(game); 
      broadcast.send(send_game("PLAYER_JOINED", data, game), game.players);
    }
  } catch (e) {
    console.log(e)
    conn.sendUTF(JSON.stringify(Object.assign(data, {
      type: e.message || e
    })));
  }
}
module.exports.add_player = add_player;


async function delete_player(data, conn) {
  try {
    console.log('Here',data.game.id);
    let content = await storage.load_game(data.game.id);
    let game = new Game(content);
    console.log('GAMESD',game, game.now)
    let unset_color = (game.now_player().username == data.game.player.username) && (game.check_can_change_color())
    let deleted_player = game.remove_player(data.game.player);
    console.log('Deleted player', deleted_player)
    storage.save_game(game);
    if (game.players.length <= 1) {
      storage.delete_game(data.game.id);
      broadcast.send(Object.assign(data, {
        type: "GAME_DELETED"
      }), game.players);
    } else {
      broadcast.send(Object.assign(data, {
        type: "PLAYER_LEFT",
        left: deleted_player
      }), game.players);

      if(unset_color)
      {
        let prev_last_card = game.used_cards[game.used_cards.length-1]
        game.set_color(prev_last_card.color || prev_last_card.type)
        game.ability = null;
        storage.save_game(game);
        broadcast.send(send_game('PUT_CARD', data, game), game.players);
      }
    }

  } catch (e) {
    console.log(e)
    conn.sendUTF(JSON.stringify(Object.assign(data, {
      type: e.message || e,
    })));
  }
}
module.exports.delete_player = delete_player;


async function start_game(data, conn) {
  try {
    let content = await storage.load_game(data.game.id);
    let game = new Game(content);
    console.log('Game before starting ', game.repr())
    game.start();
    console.log('Game after starting', game.repr())
    // console.log(game.last_card);
    storage.save_game(game);
    broadcast.send(send_game("STARTED_GAME", data, game), game.players);
  } catch (e) {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data, {
      id: data.game.id
    })));
  }
}
module.exports.start_game = start_game;


async function find_games(data, conn) {
  try{
    let username = data.player.username, games;
    if(!username || username == ''){ games = []}
    else
    {
      games = await storage.find_games(username);
    }
    let res = games.length > 0 ? {
      data: games
    } : {}
    conn.sendUTF(JSON.stringify(Object.assign({
      type: 'SET_AVAILABLE_GAMES'
    }, res)))
  }
  catch(e)
  {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data)));
  }
}
module.exports.find_available_games = find_games;


async function find_joined_games(data, conn) {
  try{
    let games = await storage.load_by_id(data.player.id);  
    let res = games.length > 0 ? {
      data: games                                           
    } : {}
    conn.sendUTF(JSON.stringify(Object.assign({
      type: 'SET_JOINED_GAMES'
    }, res)))
  }
  catch(e)
  {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data, {
      id: data.game.id
    })));
  }
}
module.exports.find_joined_games = find_joined_games;


async function delete_game(data, conn) {
  try {
    let game = await storage.load_game(data.game.id)
    storage.delete_game(data.game.id);
    broadcast.send(Object.assign(data, {
      type: "GAME_DELETED"
    }), game.players);
  } catch (e) {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data, {
      id: data.game.id
    })));
  }
}
module.exports.delete_game = delete_game;


async function get_game(data, conn) {
  try{
    let game_content = await storage.load_game(data.game.id);
    let game = new Game(game_content);
    conn.sendUTF(JSON.stringify(send_game('GAME', data, game)))
  }
  catch (e) {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data, {
      id: data.game.id
    })));
  }
}
module.exports.get_game = get_game;


const send_game = (type, data, game, args = {}) => Object.assign({},data, {
  type: type,
  game: {
    id: game.id,
    now: {
      id: game.now,
      possible_cards: game.possible_cards
    },
    last_card: {
      id: game.last_card && (game.last_card.id || game.last_card.light)
    },
    players: game.players,
    started: game.started
  },
  args
})
module.exports.send_game = send_game;



//#Inner functions(not exported)
async function check_in_game(data) {
  let games = await storage.load_by_id(data.game.player.id);
  let index = games.findIndex(game=> game.id == data.game.id)
  return index!=-1 ? games[index] : null;
}
module.exports.check_in_game = check_in_game

async function check_game_created(data)
{
  let game_created = await storage.exists_game(data.game.id)
  return game_created;
}