const logic = require("../logic/game");
const storage = require("../logic/db");
const broadcast = require("./websocket_service")

async function get_cards(data) {
  try {
    let player_id = data.player.id;
    console.log('Player_id to get_cards', player_id);
    let game_content = await storage.load_by_id(player_id);
    let game = null,
      cards;
    if (game_content == [])
      cards = [];
    else {
      console.log('Game content for getting cards:', game_content);;
      game = new logic.Game(game_content[0] || {});
      const index = game.players.findIndex(player => player.id == player_id);
      if (index == -1) throw new Error('PLAYER_NOT_FOUND')
      const now_player = game.now_player()
      console.log('Now player id', now_player.id)
      cards = game.players[index].cards;
      const possible = game.possible_cards;
      console.log('Possible cards for getting cards:', possible);
      console.log('Index of player getting cards', index);
      console.log('Cards of current player to add possible', cards);
      if (player_id == now_player.id) {
        cards = cards.map((card) => {
          if (game.check_possible(card)) {
            return {
              id: card.light,
              valid: true
            }
          } else {
            return {
              id: card.dark,
              valid: false
            };
          }
        })
      } else {
        cards = cards.map((card) => {
          return {
            id: card.dark,
            valid: false
          };
        })
      }
    }
    console.log('Getting cards', cards);
    let card_result = cards == [] ? {
      type: 'NO_CARDS'
    } : {
      type: 'GOT_CARDS',
      cards: cards
    };
    broadcast.send(Object.assign(data, card_result));
  } catch (e) {
    broadcast.send(Object.assign(data, {
      type: e.message || e,
    }));
  }

}
module.exports.get_cards = get_cards;


async function call_bluff(data) {
    try {
      let game_content = await storage.load_game(data.game.id);
      let game = new logic.Game(game_content);
      if (game.now_player().id != data.game.player.id) throw new Error('NOT_YOU');
      let res = game.check_honest(true);
      storage.save_game(game);
      broadcast.send(send_game('CALLED_BLUFF', data, game, res));
    } catch (e) {
      broadcast.send(send_game(e.message || e, data, {
        id: data.game.id
      }));
    }
  }
  module.exports.call_bluff = call_bluff;


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
      broadcast.send(send_game(skip ? 'PUT_CARD' : 'PREPARE_PASS', data, game));
    } catch (e) {
      console.log(e);
      broadcast.send(send_game(e.message || e, data, {
        id: data.game.id
      }));
    }
  }
  module.exports.pass = pass;
  
  
  async function put_card(data) {
    let game = null;
    try {
      const player_id = data.player.id;
      const game_content = await storage.load_by_id(player_id);
      game = new logic.Game(game_content[0]);
      if (game.now_player().id != player_id) throw new Error('NOT_YOU');
      let res = game.put_card(data.card.id);
      storage.save_game(game);
      if (res.winner) {
        broadcast.send('WINNER', data, game, {
          winner: res.winner
        });
      }
      broadcast.send(send_game(res.change_color ? 'CHANGE_COLOR' : res.can_call_bluff ? 'CAN_CALL_BLUFF' : 'PUT_CARD', data, game, res));
    } catch (e) {
      broadcast.send(send_game(e.message || e, data, game));
    }
  }
  module.exports.put_card = put_card;


  async function set_color(data) {
    try {
      let game_content = await storage.load_game(data.game.id);
      let game = new logic.Game(game_content);
      if (data.game.player.id != game.now_player().id) throw new Error('NOT_YOU');
      let res = game.set_color(data.color);
      storage.save_game(game);
      broadcast.send(send_game('PUT_CARD', data, game, res));
    } catch (e) {
      broadcast.send(send_game(e.message || e, data, {
        id: data.game.id
      }));
    }
  
  }
  module.exports.set_color = set_color;



  //#Inner functions(not exported)

async function check_in_game(data) {
    let games = await storage.load_by_id(data.game.player.id);
    return games.length != 0;
  }