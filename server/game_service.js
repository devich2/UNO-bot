const logic = require("../logic/game");
const storage = require("../logic/db");
const broadcast = require("./websocket_service")

async function create_game(data, conn) {
  try {
    let in_game = await check_in_game(data), game;
    if (in_game) {
      game = new logic.Game(in_game)
      conn.sendUTF(JSON.stringify(Object.assign(data, {
        type: 'ALREADY_IN_GAME'
      }, game)))
    } else {
        game = new logic.Game({
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


async function continue_game(data,conn)
{
  try {
    let in_game = await check_in_game(data), game;
    if (!in_game) {
      conn.sendUTF(JSON.stringify(Object.assign(data, {
        type: 'NOT_IN_GAME'
      })));
    } else {
      game = new logic.Game(in_game);
      conn.sendUTF(JSON.stringify(send_game("GOT_GAME", data, game)));
    }
  } catch (e) {
    console.log(e)
    conn.sendUTF(JSON.stringify(Object.assign(data, {
      type: e.message || e
    })));
  }
}
module.exports.continue_game = continue_game;


async function add_player(data, conn) {
  try {
    let in_game = await check_in_game(data), content, game;
    if (in_game) {
      console.log('IN GAME')
      game = new logic.Game(in_game)
      conn.sendUTF(JSON.stringify(Object.assign(data, {
        type: 'ALREADY_IN_GAME'
      }, game)));
    } else {
     content = await storage.load_game(data.game.id);
     game = new logic.Game(content);
      game.add_player(data.game.player);
      storage.save_game(game);
      console.log('Game after adding player', game);
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
    console.log('Here');
    let content = await storage.load_game(data.game.id);
    let game = new logic.Game(content);
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
    let game = new logic.Game(content);
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
    broadcast.send(send_game('GAME_DELETED'), game.players);
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
    let game = new logic.Game(game_content);
    conn.sendUTF(JSON.stringify(send_game('GAME', data, game)))
  }
  catch (e) {
    conn.sendUTF(JSON.stringify(send_game(e.message || e, data, {
      id: data.game.id
    })));
  }
}
module.exports.get_game = get_game;


const send_game = (type, data, game, args = {}) => Object.assign(data, {
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
    players: game.players
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