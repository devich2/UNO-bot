const Card = require("../../logic/card")
const card_deck = require("../../logic/uno_cards");
const Player = require("../../logic/player")
const create_card = (content, type, color, only_id = false) => {
    for (let card of card_deck) {
      if (card.content == content && card.type == type) 
      { 
        if(only_id) return Object.assign({id: card.light}, color ? {color: color} : {})
        return new Card(Object.assign({}, card, color? {color: color} : {}))
    }
    }
  }

  module.exports.create_card = create_card

  const get_random_int = (min, max)=> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  const get_random_cards = (amount)=>
{
   let cards = [];
   for(let i = 0;i<amount; i++)
   {
      let random_card = card_deck[get_random_int(0,card_deck.length-1)]
      cards.push({id: random_card.light})
   }
   console.log(cards);
   return cards
}

module.exports.get_cards = get_random_cards


const create_random_players = (amount = 0, cards_amount = 0)=>
{
  let players = []
  for(let i = 0 ; i < amount; i++)
  {
    let username, id; 
    username = id = rand_hash(6)
    let cards = get_random_cards(cards_amount)
    players.push({id:id, username:username, cards: cards} )
  }
  return players
}
module.exports.create_players = create_random_players


//#Inner for me
const rand_hash = (length) => {
  let hash          = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     hash += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return hash;
}