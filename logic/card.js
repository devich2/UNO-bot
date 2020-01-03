class Card {
    constructor(dict) {
    
        Object.assign(this, {}, dict)
        if (!this.is_wild_card() && this.color != undefined) {
            throw Error('Only wild cards can be initialized with no color');
          }
    }

    toString() {
        return JSON.stringify(this.repr())
    }
    
    
      set_color(color) {
        if (!this.is_wild_card())
          throw new Error('Only wild cards can have theirs colors changed.');
        else if (color != 'r' && color !='b' && color !='g' && color !='y')
          throw new Error('Invalid color.');
    
        this.color = color;
      }

    is_special_card() {
        return this.is_wild_card() || this.content == "skip" || this.content == "draw" ||
            this.content == "reverse";
    }

    repr() {
        return Object.assign({
            id: this.id || this.light      
        }, this.color ? {color: this.color}: {})
    }

    is_wild_card()
    {
        return this.content == 'four' || this.content == 'color';
    }

    get score() {
        switch (this.content) {
          case 'draw':
              return 20
          case 'skip':
              return 20
          case 'reverse':
            return 20;
          case 'color':
              return 50
          case 'four':
            return 50;
          default:
            return this.content;
        }
      }
    
}

module.exports = Card