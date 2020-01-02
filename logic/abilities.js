const abilities = {
   'four': () => {
      return (game, result) => {
         let prev;
         let turn = game.now - game.turn
         if (turn < 0) {
            prev = game.players.length + turn
         } else if (turn >= game.players.length) {
            prev = turn - game.players.length
         } else {
            prev = turn
         }
         result.prev_player = game.players[prev_player]
         for (let card of game.players[prev].cards) {
            if (card.type == game.last_card.color) {
               game.players[prev].cards = game.players[prev].cards.concat(game.get_some_cards(4));
               result.bluffed = true;
               return null;
            }
         }
         game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(6));
         result.bluffed = false;
         return null;
      }
   },
   'reverse': (game) => {
      game.turn *= -1;
      if (game.players.length == 2) game.next();
      return null;
   },
   'draw': () => {
      return (game) => {
         game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(2));
         game.next();
         return null;
      }
   },
   'skip': (game) => {
      game.next();
      return null;
   },
   'draw_one': (game, skip) => {
      if (!skip) {
         game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(1));
      }
      return null;
   },
   'color': () => null,
   'simple': () => null,
}
module.exports = abilities;