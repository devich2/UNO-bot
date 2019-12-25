const logic = require("./bot/objects");
const storage = require("./bot/db");
const errs = {
  "No game with such an id": "NOT_FOUND_GAME",
  "Not enough players to start": "NOT_ENOUGH_PLAYERS",
  'No player with such an id': 'PLAYER_NOT_FOUND',
  "Not your step": "NOT_YOU",
  "Put away your card": "NOT_POSSIBLE_CARD"
}

var http = require('http');
var webSocketServer = require('websocket').server;
var webSocketsServerPort = process.env.PORT; //process.env.PORT
var server = http.createServer(function (request, response) {});

server.listen(webSocketsServerPort, '0.0.0.0', function () {
  console.log((new Date()) + " Server is listening on port " +
    webSocketsServerPort);
});
var wsServer = new webSocketServer({
  httpServer: server
});

let clients = [];
let admin_client = null;

function save_connection(data, conn) {
  for (let i in clients) {
    for (let key in clients[i]) {
      if (clients[i][key] == conn) {
        clients.splice(i, 1);
        let client = {};
        client[data.id] = conn;
        clients.push(client);
        //console.log(clients);
      }
    }
  }
}

async function check_in_game(data) {
  console.log('Game id to check in_game', data.game.id);
  let games = await storage.load_by_id(data.game.player.id);
  return games.length != 0;
}

async function create_game(data, conn) {
  try{
    let in_game = await check_in_game(data);
  if (in_game) {
    await add_player(data, conn)
  } 
  else {
    let game = new logic.Game({
      id: data.game.id,
      players: [data.game.player]
    });
    storage.save_game(game);

    broadcast({
      type: 'GAME_CREATED',
      id: game.id,
      players: game.players
    });
  }
  }
  catch(e)
  {
    broadcast({
      type: e.message || e,
      id: game.id,
      players: game.players
    });
  }
  
}

async function add_player(data, conn) {
  try{
    let in_game = await check_in_game(data);
    if (in_game) {
     broadcast(Object.assign(data, {
        type: 'ALREADY_IN_GAME'
      }));
    } else {
      let content = await storage.load_game(data.game.id);
      let game = new logic.Game(content);
      game.add_player(data.game.player);
      storage.save_game(game);
      console.log('Game after adding player',game);
      broadcast(send_game("PLAYER_JOINED", data, game));
    }
  }
  catch(e)
  {
    console.log(e)
    broadcast(Object.assign(data, {
      type: e.message || e
    }));
  }
   
}

function broadcast(data, players) {
  clients.forEach(client => {
    for (let key in client) {
      if (players && players.findIndex(player => player.id == key) != -1) {
        client[key].sendUTF(JSON.stringify(data));
      }
    }
  })
  if (admin_client) admin_client.sendUTF(JSON.stringify(data)); //suka

}
async function delete_player(data, conn) {
  try
  {
    console.log('Here');
    let content = await storage.load_game(data.game.id);
   let game = new logic.Game(content);
   let res =  game.check_over();
   let deleted_player = game.remove_player(data.game.player);
   console.log('Deleted player', deleted_player)
   storage.save_game(game);
  if(game.players.length<=1) 
  {
    storage.delete_game(data.game.id);
    broadcast(Object.assign(data, {
      type: "GAME_DELETED"
    }, res));
  } 
  else
  {
    broadcast(Object.assign(data, {
      type: "PLAYER_LEFT",
      left: deleted_player
    }, res));
  }
  
  }
  catch(e)
  {
    console.log(e)
    broadcast(Object.assign(data, {
      type: e.message || e,
    }));
  }
}

async function get_cards(data) {
  try{
    let player_id = data.player.id;
    console.log('Player_id to get_cards', player_id);
    let game_content = await storage.load_by_id(player_id);
    let game = null, cards;
    if (game_content == [])
      cards = [];
    else {
      console.log('Game content for getting cards:',game_content);;
      game = new logic.Game(game_content[0] || {});
      const index = game.players.findIndex(player => player.id == player_id);
      if(index == -1) throw new Error('PLAYER_NOT_FOUND')
      const now_player = game.now_player()
      console.log('Now player id', now_player.id)
      cards = game.players[index].cards;
      const possible = game.possible_cards;
      console.log('Possible cards for getting cards:', possible);
      console.log('Index of player getting cards', index);
      console.log('Cards of current player to add possible', cards);
      if (player_id == now_player.id) {
        cards = cards.map((card) => {
          if(game.check_possible(card))
          {
            return {
              id: card.light,
              valid: true
            }
          }
          else
          {
            return {
              id: card.dark,
              valid: false
            };
          }
        })
      }
      else{
        cards = cards.map((card) => {
          return {
            id: card.dark,
            valid: false
          };
        }
        )
      }
    }
    console.log('Getting cards', cards);
    let card_result = cards == [] ? {
      type: 'NO_CARDS'
    } : {
      type: 'GOT_CARDS',
      cards: cards
    };
    broadcast(Object.assign(data, card_result));
  }
  catch(e)
  {
    broadcast(Object.assign(data, {
      type: e.message || e,
    }));
  }
  
}

const send_game = (type, data, game , args) => Object.assign(data, {
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

async function start_game(data, conn) {
  try {
    let content = await storage.load_game(data.game.id);
    let game = new logic.Game(content);
    console.log('Game before starting ', game.repr())
    game.start();
    console.log('Game after starting', game.repr())
    // console.log(game.last_card);
    storage.save_game(game);
    broadcast(send_game("STARTED_GAME", data, game));
  } catch (e) {
    console.log(e)
    broadcast(send_game(e.message || e, data, {
      id: data.game.id
    }));
  }
}

async function call_bluff(data) {
  try
  {
    let game_content = await storage.load_game(data.game.id);
  let game = new logic.Game(game_content);
  if (game.now_player().id != data.game.player.id) throw new Error('NOT_YOU');
  let res = game.check_honest(true);
  storage.save_game(game);
  broadcast(send_game('CALLED_BLUFF', data, game, res));
  }
  catch(e)
  {
    broadcast(send_game(e.message || e, data, {
      id: data.game.id
    }));
  }
}

async function pass(data, skip) {
  try {
    console.log('Skip', skip);
    console.log('PASSING');
    console.log(data.game.id);
    let game_content = await storage.load_game(data.game.id);
    console.log('GAME_CONTENT', game_content)
    let game = new logic.Game(game_content);
    if (game.now_player().id != data.game.player.id) throw new Error('NOT_YOU');
    game.pass(skip);     
    storage.save_game(game);
    broadcast(send_game(skip ? 'PUT_CARD' : 'PREPARE_PASS', data, game));
  } catch(e) {
    console.log(e);
    broadcast(send_game(e.message || e, data, {
      id: data.game.id
    }));
  }
}

async function put_card(data) {
  let game = null;
  try {
    const player_id = data.player.id;
    const game_content = await storage.load_by_id(player_id);
    game = new logic.Game(game_content[0]);
    if (game.now_player().id != player_id) throw new Error('NOT_YOU');
    let res = game.put_card(data.card.id);
    storage.save_game(game);
    if(res.winner)
    {
      broadcast('WINNER', data, game, {winner: res.winner});
    }
    broadcast(send_game(res.change_color ? 'CHANGE_COLOR' : res.can_call_bluff ? 'CAN_CALL_BLUFF' : 'PUT_CARD', data, game, res));
  } catch (e) {
    broadcast(send_game(e.message || e, data, game));
  }
}

async function find_games(data, conn) {
  let games = await storage.find_games(data.username);
  let res = games.length>0 ? {data: games} : {}
  conn.sendUTF(JSON.stringify(Object.assign({
    type: 'SET_GAMES'}, res)))
}

async function set_color(data) {
  try {
    let game_content = await storage.load_game(data.game.id);
    let game = new logic.Game(game_content);
    if(data.game.player.id != game.now_player().id) throw new Error('NOT_YOU');
    let res = game.set_color(data.color);
    storage.save_game(game);
    broadcast(send_game('PUT_CARD', data, game, res));
  } catch (e) {
    broadcast(send_game(e.message || e, data, {
      id: data.game.id
    }));
  }

}
function delete_game(data,conn)
{
  try{
    storage.delete_game(data.game.id);
    broadcast(send_game('GAME_DELETED'));
  }
  catch(e)
  {
    broadcast(send_game(e.message || e, data, {
      id: data.game.id
    }));
  }
}
async function get_game(data, connection)
{
  let game_content = await storage.load_game(data.game.id);
  let game = new logic.Game(game_content);
  broadcast(send_game('GAME', data, game));
}
wsServer.on('request', function (request) {
  let connection = request.accept(null, null);
  clients.push({
    'unknown': connection
  });
  connection.on('message', function (message) {
    if (message.type == 'utf8') {
      let data = JSON.parse(message.utf8Data);
      switch (data.type) {
        case 'SAVE_CONNECTION':
          if (data.admin) admin_client = connection;
          else save_connection(data, connection);
          break;
        case 'CREATE_GAME':
          create_game(data, connection);
          break;
        case 'ADD_PLAYER':
          add_player(data, connection);
          break;
        case 'DELETE_PLAYER':
          delete_player(data, connection);
          break;
        case 'START_GAME':
          start_game(data, connection);
          break;
        case 'PUT_CARD':
          put_card(data);
          break;
        case 'CALL_BLUFF':
          call_bluff(data,connection);          
          break;
        case 'PASS':
          pass(data, true);
          break;
        case 'SET_COLOR':
          set_color(data,connection);
          break;
        case 'FIND_GAMES':
          find_games(data, connection);
          break;
        case 'GET_CARDS':
          get_cards(data, connection);
          break;
        case 'GET_GAME':
          get_game(data,connection);
          break;
        case 'GET_CARD':
          pass(data, false);
          break;
        case 'DELETE_GAME':
         delete_game(data,connection);
         break;
        
      }
    }
  });
  connection.on('close', function (connection) {
    for (let i in clients) {
      for (let key in clients[i]) {
        if (clients[i][key] == connection) {
          clients.splice(i, 1);
        }
      }
    }
  });
});