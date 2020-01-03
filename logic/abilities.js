const abilities = {
   'four': () => {
      return (game, check , result) => {
         if(check)
         {
            let prev_player = game.prev_player()
            result.prev_player = prev_player 
            for (let card of prev_player.cards) {
               if (card.type == game.last_card.color) {
                  game.private_draw(prev_player,4);
                  result.bluffed = true;
                  return null;
               }
            }
            game.private_draw(game.now_player(),6);
            result.bluffed = false;
            return null;
         }
         else 
         {
            game.private_draw(game.now_player(),4)
            return null
         }
     
      }
   },
   'reverse': (game) => {
      game.turn *= -1;
      if (game.players.length == 2) game.next();
      return null;
   },
   'draw': () => {
      return (game) => {
         game.private_draw(game.now_player(), 2);
         //game.next();
         return null;
      }
   },
   'skip': (game) => {
      game.next();
      return null;
   },
   'draw_one': (game, skip) => {
      if (!skip) {
         game.private_draw(game.now_player(),1)
      }
      return null;
   },
   'color': () => null,
   'simple': () => null,
}
module.exports = abilities;