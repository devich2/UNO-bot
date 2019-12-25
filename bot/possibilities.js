const cards = require('./uno_cards')
const {Card} = require('./objects')


const find_card = (id) => {
  for (let card of cards) {
    if (card.light == id) return new Card(card)
  }
}

const possibilities = {

    'four': (card)=>
    {
        return [{'type' : card.color}, {'content': 'four'}, {'content': 'color'}];
    },
    'reverse': (card)=>
    {
       return [{'content': 'reverse'}, {'type': card.type}];
    },
    'draw': (card)=>
    {
       return [{'content': card.content}];
    },
    'skip': (card)=>
    {
       return [{'content': card.content}, {'type': card.type}];
    },
    'color': (card)=>
    {
        return [{'type': card.color}, {'content': 'four'}, {'content': 'color'}];
    },
    'simple': (card)=>
    {
       
        return [{'content':  card.content}, {'type': card.type}, {'content': 'four'}, {'content': 'color'}];
    },
    'any': (card)=>
    {
        return [{type: card.color || card.type}];
    }

}
module.exports = possibilities;