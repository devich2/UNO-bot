const Card = require("../logic/card")
const Game = require("../logic/game")
const Player = require("../logic/player")
const card_deck = require("../logic/uno_cards");
const Values = require("./help-data/values")
const Types = require("./help-data/types")
const Colors = require("./help-data/colors")

const create_card = (content, type, color) => {
    for (let card of card_deck) {
      if (card.content == content && card.type == type) return new Card(Object.assign({}, card, color? {color: color} : {}))
    }
  }

describe('Card', ()=>
{
    describe('#constructor', function() {
        it('should create simple cards with no color', () => {
          expect(() => create_card(Values.ZERO, Types.BLUE)).not.toThrow();
        });
    
        it('should create wild cards with no color', () => {
          expect(() => create_card(Values.WILD, Types.WILD)).not.toThrow();
        });
    
        it('should create wild cards with a color', () => {
          expect(() => create_card(Values.WILD, Types.WILD, Colors.BLUE)).not.toThrow();
        });
    
        it('should error if color is invalid', () => {
          expect(() => create_card(Values.WILD, Types.WILD, 'orange')).toThrow('Invalid color.');
          expect(() => create_card(Values.ZERO, 'orange')).toThrow('Invalid color.');
        });
})

describe('#value', function() {
  it('should return the correct value', () => {
    const zero = create_card(Values.ZERO, Types.BLUE);
    expect(zero.content).toBe('0');

    const wild = create_card(Values.WILD, Types.WILD);
    expect(wild.content).toBe('color');
  });
});


describe('#color', function() {
  it('should return the correct color', () => {
    const zero = create_card(Values.ZERO, Types.RED);
    expect(zero.type).toBe('r');

    const wild = create_card(Values.WILD, Types.WILD);
    expect(wild.color).toBeUndefined();
    expect(wild.type).toBe('choose');

    const wild_draw_four = create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR, Colors.RED);
    expect(wild_draw_four.color).ToBe('r');
    expect(wild_draw_four.type).toBe('draw');
  });


  it('should allow wild cards to change colors', () => {
    const wild = create_card(Values.WILD, Types.WILD);
    expect(wild.color).toBeUndefined();

    expect(() => (wild.set_color('r'))).not.toThrow();
    expect(wild.color).toBe('r');

    expect(() => (wild.set_color('y'))).not.toThrow();
    expect(wild.color).toBe('y');
    
    expect(() => (wild.set_color('o'))).toThrow('Invalid color.');
    expect(wild.color).toBe('y');

  });

  it('should prevent normal or special cards from changing colors', () => {
    const zero = create_card(Values.ZERO, Types.BLUE);
    expect(zero.color).toBeUndefined();
    expect(() => (zero.set_color('r'))).toThrow('Only wild cards can have theirs colors changed.');
    expect(zero.color).toBeUndefined();


    const reverse = create_card(Values.REVERSE, Types.GREEN)
    expect(reverse.content).toBe('reverse');
    expect(() => (reverse.set_color('r'))).toThrow('Only wild cards can have theirs colors changed.');
    expect(reverse.color).toBeUndefined();

  });
})

describe('#score', function() {
  it('should return the correct score for each card', () => {
    expect(create_card(Values.ZERO, Types.RED).score).toBe(0);
    expect(create_card(Values.THREE, Types.RED).score).toBe(3);
    expect(create_card(Values.FIVE, Types.RED).score).toBe(5);
    expect(create_card(Values.NINE, Types.RED).score).toBe(9);
    expect(create_card(Values.WILD, Types.WILD).score).toBe(50);
    expect(create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR).score).toBe(50);
    expect(create_card(Values.REVERSE, Types.RED).score).toBe(20);
    expect(create_card(Values.SKIP, Types.RED).score).toBe(20);
    expect(create_card(Values.DRAW_TWO, Types.RED).score).toBe(20);
  });
});



})