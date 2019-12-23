const abilities = 
{
    'four': ()=>
    {
       return (game, honest_check = false, result)=>
       {
          
              if (honest_check) 
              {
               let prev;
               let turn = game.now - game.turn
               if (turn < 0) {
                   prev = game.players.length + turn
               } else if (turn >= game.players.length){
                   prev = turn - game.players.length
               } else {
                   prev = turn
               }
               console.log(game.now, prev);
               console.log('Checking honst:', game.players[prev]);
                 for(let card of game.players[prev].cards)
                 {
                    console.log('His', card.type, 'Color', game.last_card.color);
                     if(card.type == game.last_card.color)
                     {
                        game.players[prev].cards = game.players[prev].cards.concat(game.get_some_cards(4));
                        result.bluffed = true;
                        console.log("Trued");
                        return null;
                     }
                 }
                 game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(6));
                 result.bluffed = false;
              }
              else{
                game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(4));
                result.check_honest = false;
              }
              return null;
       }
    },
    'reverse':  (game)=>
    {
       game.turn*=-1;
       if(game.players.length == 2) game.next();
       return null;
    },
    'draw':  ()=>
    {
       return (game)=>
       {
          game.now_player().cards =  game.now_player().cards.concat(game.get_some_cards(2));
          game.next();
          return null;
       }
    },
    'skip':  (game)=>
    {
          game.next();
          return null;
    },
    'color':  ()=>
    {
       return null;
    },
    'simple': (game)=>
    {
      //   let cards = game.now_player().cards;
      //   const i = cards.findIndex(c=>card.content == c.content && card.type == c.type);
      //   cards.splice(i,1);
      return null;
    },
    'draw_one': (game)=>
    {
        game.now_player().cards = game.now_player().cards.concat(game.get_some_cards(1));
        return null;
    }
}
module.exports = abilities;