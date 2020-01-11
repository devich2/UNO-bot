const Player = require("../logic/player")
const Values = require("./help-data/values")
const Types = require("./help-data/types")
const create_card = require('./help-data/card-helper').create_card

describe('Player', function() {
    it('should have a username and id', () => {
        expect(()=>new Player({})).toThrow('Player username and telegram id neccessary.')

    });

    let cards, player;
    beforeEach(() => {
      cards = [{id: 'CAADAgADmwMAAk9wUEgGjFv_XetVPAI'}, {id: 'CAADAgAD3AIAAseySUhy5e5w5AYaqwI'}]
      player = new Player({id: '223132', username: 'devich2', first_name: 'Devid', last_name: 'Aka', cards:cards})
    });
    
    describe('#remove player card',()=>
    {
        it('should remove player card and return its copy', () => {
            
           const deleted_card = player.remove_card(player.cards[0])
           expect(deleted_card).not.toBeUndefined()
           expect(player.cards.length).toBe(1);
           expect(player.cards.includes(deleted_card)).toBe(false)
        });
        it('should error if card isn\'t on hand', () => {
            const card_to_delete = create_card(Values.NINE, Types.GREEN)
            expect(()=> player.remove_card(card_to_delete)).toThrow(/Player doesnt have/)
            expect(player.cards.length).toBe(2);
         });
    })
    
    
    describe('#check if card is on hand', function() {
      it('should return true', () => {
        expect(player.has_card(player.cards[0])).toBe(true)
      });
      it('should return false', () => {
        expect(player.has_card(create_card(Values.NINE, Types.GREEN))).toBe(false)
      });
    });
  });

