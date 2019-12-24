const log = require("./objects");
const storage = require("./db");
 let players = [new log.Player({id: 300, full_name: 'Davids'}),new log.Player({id: 340, full_name: 'Sonya'})];
 let game = new log.Game({id: 22, players: players, last_card: {id:320}});
storage.save_game(game);
storage.load_game(22).then((obj)=>
 {
      game = new log.Game (obj);
      game.start();
      console.log('Game', game);
      storage.save_game(game);
 });


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