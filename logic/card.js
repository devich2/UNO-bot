class Card {
    constructor(dict) {
        Object.assign(this, {}, dict)
    }

    toString() {
        return JSON.stringify(this.repr())
    }
    
    is_special() {
        return this.content == "four" || this.content == "skip" || this.content == "draw" || this.content == "color" ||
            this.content == "reverse";
    }

    repr() {
        return {
            id: this.id || this.light,
            color: this.color || undefined
            
        }
    }

    is_choosing_color()
    {
        return this.content == 'four' || this.content == 'color';
    }
}

module.exports = Card