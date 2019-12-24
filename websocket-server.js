var webSocketsServerPort = process.env.PORT; //process.env.PORT
const logic = require("./bot/objects");
const storage = require("./bot/db");
var webSocketServer = require('websocket').server;
var http = require('http');



var server = http.createServer(function (request, response) {});
server.listen(webSocketsServerPort, function () {
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
  console.log('Id', data.game.id);
  let games = await storage.load_by_id(data.game.player.id);
  return games.length != 0;
}

async function create_game(data, conn) {
  let in_game = await check_in_game(data);
  if (in_game) {
    conn.sendUTF(JSON.stringify({
      type: 'ALREADY_IN_GAME',
      player: data
    }))
    if (admin_client != conn) admin_client.sendUTF(JSON.stringify({
      type: 'ALREADY_IN_GAME',
      player: data
    }))
  } else {
    let game = new logic.Game({
      id: data.game.id,
      players: [data.game.player]    
    });
    // console.log(game);
    console.log('CreatedGame:', game);
    console.log('CreatedData:', data);
    storage.save_game(game);
    conn.sendUTF(JSON.stringify({
      type: 'GAME_CREATED',
      id: game.id,
      players: game.players
    }))
    if (admin_client != conn) admin_client.sendUTF(JSON.stringify({
      type: 'GAME_CREATED',
      id: game.id,
      players: game.players
    }))
  }
}

async function add_player(data, conn) {
  console.log('AddedData:', data);
  let in_game = await check_in_game(data); 
  if (in_game) {
    conn.sendUTF(JSON.stringify(Object.assign(data,{type: 'ALREADY_IN_GAME'})));
    if (admin_client != conn) admin_client.sendUTF(Object.assign( data, {type: 'ALREADY_IN_GAME'}))

  } else {
    let content = await storage.load_game(data.game.id);
    let game = new logic.Game(content);
    game.add_player(data.game.player);
    storage.save_game(game);
    broadcast({
      type: "PLAYER_JOINED",
      id: game.id,
      players: game.players
    }, game.players)
  }
}

function broadcast(data, players) {
  clients.forEach(client => {
    for (let key in client) {
      if (players.findIndex(player => player.id == key) != -1) {
        client[key].sendUTF(JSON.stringify(data));
      }
    }
  })
  if (admin_client) admin_client.sendUTF(JSON.stringify(data)); //suka

}
async function delete_player(data, conn) {
  let content =  await storage.load_game(data.game.id);
  let game = new logic.Game(content);
  let deleted_player = game.remove_player(data.game.player);
  storage.delete_game(data.game.id);
  broadcast(Object.assign(data, { type: "PLAYER_LEFT", left: deleted_player}), game.players);                                                                       
}

async function get_cards(data)
{
  let player_id = data.player.id;
  let game_content = await storage.load_by_id(player_id);
  let card_result = {};
  if(game_content == []) card_result = {type:'NO_CARDS'};
  else{
    let game = new logic.Game(game_content[0]);
    let index = game.players.findIndex(player=>player.id==player_id);
    let cards = game.players[index].cards;
    card_result = cards == [] ? {type:'NO_CARDS'} : {type:'GOT_CARDS', cards: cards};
  }
  if(admin_client) admin_client.sendUTF(Object.assign(data, card_result, game.now_player().id == player_id ? {possible_cards: game.possible_cards} : {} ));
}

async function start_game(data, conn) {
  let content = await storage.load_game(data.id);
  try {
    let game = new logic.Game(content);
    game.start();
    storage.save_game(game);
    broadcast({
      type: "GAME_STARTED",
      id: game.id,
      possible_cards: game.possible_cards,
      last_card: game.last_card,
      now: game.now,
      players: game.players
    }, game.players);
  } catch {
    conn.sendUTF(JSON.stringify({
      type: 'NOT_ENOUGH_PLAYERS'
    }));
  }

}

async function call_bluff(data) {
  let game = await storage.load_game(data.id_creator);
  game.check_honest(true);
  storage.save_game(game);
  broadcast({
    type: "CALLED_BLUFF",
    id: game.id,
    possible_cards: game.possible_cards,
    last_card: game.last_card,
    now: game.now,
    players: game.players
  }, game.players);
}

async function pass() {
  let game = await storage.load_game(data.id_creator);
  game.pass();
  storage.save_game(game);
  broadcast({
    type: "PASSED",
    id: game.id,
    possible_cards: game.possible_cards,
    last_card: game.last_card,
    now: game.now,
    players: game.players
  }, game.players);
}

async function put_card(data) {
  if (!data.id_creator) {

  }
  let game = await storage.load_game(data.id_creator);
  game.put_card(data.card);
  storage.save_game(game);
  broadcast(Object.assign({
    type: "PUT_CARD",
    id: game.id,
    possible_cards: game.possible_cards,
    last_card: game.last_card,
    now: game.now,
    players: game.players
  }), game.players);
}

async function find_games(data, conn) {
  let games = await storage.find_games(data.username);
  conn.sendUTF(JSON.stringify({
    type: 'SET_GAMES',
    data: games
  }))
}

async function set_color(data) {
  let game = await storage.load_game(data.id_creator);
  game.set_color(data.color);
  storage.save_game(game);
  broadcast({
    type: "SET_COLOR",
    id: game.id,
    color: game.last_card.color,
    possible_cards: game.possible_cards,
    last_card: game.last_card,
    now: game.now,
    players: game.players
  }, game.players);
}

wsServer.on('request', function (request) {
  let connection = request.accept(null, null);
  clients.push({
    'unknown': connection
  });
  connection.on('message', function (message) {
    if (message.type == 'utf8') {
      let data = JSON.parse(message.utf8Data);
      //console.log(data); {type:'CRARE', hello: world, oweq: , id_player: , }
      switch (data.type) {
        case 'SAVE_CONNECTION':
          if (data.admin) admin_client = connection;
          else save_connection(data, connection);
          break;
        case 'CREATE_GAME':
          console.log('nice');
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
          call_bluff(data);
          break;
        case 'PASS':
          pass(data);
          break;
        case 'SET_COLOR':
          set_color(data);
          break;
        case 'FIND_GAMES':
          find_games(data, connection);
          break;
        case 'GET_CARDS':
          get_cards(data, connection);
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