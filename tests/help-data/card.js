const Card = require("../../logic/card")
const card_deck = require("..//../logic/uno_cards");

const create_card = (content, type, color) => {
    for (let card of card_deck) {
      if (card.content == content && card.type == type) return new Card(Object.assign({}, card, color? {color: color} : {}))
    }
  }

  module.exports = create_card