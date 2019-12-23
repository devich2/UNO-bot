const log = require("./objects");
const storage = require("./db");
// let players = [new log.Player({id: 300, full_name: 'Davids'}),new log.Player({id: 340, full_name: 'Sonya'})];
// let game = new log.Game({id: 22, players: players, });
// game.start();
// storage.save_game(game);

storage.delete_game(22);
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