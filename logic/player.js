const card_deck = require("./uno_cards");
const Card = require('./card')

const find_card = (id) => {
    for (let card of card_deck) {
      if (card.light == id) return new Card(card)
    }
  }
class Player {
    constructor(dict) {
        this.id = dict.id
        this.username = dict.username ? dict.username : '';
        this.full_name = dict.full_name ? dict.full_name : dict.first_name + (dict.last_name ? ' ' + dict.last_name : '')
        this.cards = dict.cards ? dict.cards.map(card => find_card(card.id)) : [];
    }

    toString() {
        return JSON.stringify(this.repr())
    }

    has_card(card) {
        if (!card) return false;
    
        return this.cards.some(
          c => c.type === card.type && c.content === card.content
        );
      }

    remove_card(card) {
        if (!this.has_card(card)) return;
        const index = this.cards.findIndex(c => c.content == card.content && c.type == card.type);
        return this.cards.splice(index, 1)[0];
    }
    
    repr() {
        return {
            id: this.id,
            full_name: this.full_name,
            cards: this.cards ? this.cards.map((card) => card.repr()) : [],
            username: this.username ? this.username : ''
        }
    }
}
module.exports = Player
