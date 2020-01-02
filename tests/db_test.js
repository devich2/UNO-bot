const log = require("../logic/game");
const Player = require("../logic/player")
const storage = require("../logic/db");
const abilities = require("../logic/abilities")
get();
async function get()
{
     let content = await storage.load_game('-212661584');
     let game = new log.Game(content);
     //game.start();
     // let index = game.cards.findIndex(card=>card.content == 'draw');
     // game.last_card = game.cards.splice(index,1)[0]
     // game.end_turn(false);
     //game.add_player(new Player({id: '343', username: 'antony', 'full_name': 'Antonio_Margareta'}))
     console.log(game.now_player().cards);
     game.ability = abilities[game.last_card.content]();
     game.pass(false);

     storage.save_game(game);
     //console.log(game.possible_cards, game.now_player().cards);
}
// //  storage.load_game(7).then((obj)=>
// //  {
// //       game = new log.Game (obj);
// //  });
//  (async ()=>
//  {
//      let s = await storage.load_by_id(300);
//      console.log(s.length,s[0]);
//  }
//  )()