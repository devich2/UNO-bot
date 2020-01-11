
const Values = require("./help-data/values")
const Types = require("./help-data/types")
const Colors = require("./help-data/colors")
const Card = require("../logic/card")
const Game = require("../logic/game")
const Player = require("../logic/player")
const test_data = require("./help-data/test-data")
const create_card = require("./help-data/card-helper").create_card

describe('#Game', () => {
    describe('#Constructor', () => {
        let game;
        it('should have a public API', function() {
            expect(()=> game = new Game({id: '343', creator: 'devich2'})).not.toThrow()
            expect(game).toHaveProperty('id');
            expect(game).toHaveProperty('now');
            expect(game).toHaveProperty('creator');
            expect(game).toHaveProperty('last_card');
            expect(game).toHaveProperty('used_cards');
            expect(game).toHaveProperty('cards');
            expect(game).toHaveProperty('possible_cards');
            expect(game).toHaveProperty('players');
            expect(game).toHaveProperty('turn');
            expect(game).toHaveProperty('ability');
            expect(game).toHaveProperty('started');
            expect(game).toHaveProperty('drawn');

            expect(typeof game.now_player).toBe('function');
            expect(typeof game.prev_player).toBe('function');
            expect(typeof game.repr).toBe('function');
            expect(typeof game.add_player).toBe('function');
            expect(typeof game.remove_player).toBe('function');
            expect(typeof game.next).toBe('function');
            expect(typeof game.reload_cards).toBe('function');
            expect(typeof game.get_some_cards).toBe('function');
            expect(typeof game.private_draw).toBe('function');
            expect(typeof game.drop).toBe('function');
            expect(typeof game.get_start_cards).toBe('function');
            expect(typeof game.start).toBe('function');
            expect(typeof game.add_possible).toBe('function');
            expect(typeof game.check_possible).toBe('function');
            expect(typeof game.check_winner).toBe('function');
            expect(typeof game.put_card).toBe('function');
            expect(typeof game.calculate_score).toBe('function');
            expect(typeof game.check_honest).toBe('function');
            expect(typeof game.check_can_call_bluff).toBe('function');
            expect(typeof game.check_can_change_color).toBe('function');
            expect(typeof game.set_color).toBe('function');
            expect(typeof game.pass).toBe('function');
            expect(typeof game.is_over).toBe('function');
            expect(typeof game.end_turn).toBe('function');
            expect(typeof game.no_cards).toBe('function');

          });

          it('should create game with default parameters', () => {
            expect(()=> game = new Game({id: '343', creator: 'devich2'})).not.toThrow()
            expect(game.last_card).toBeNull()
            expect(game.used_cards).toHaveLength(0)
            expect(game.cards).toHaveLength(0)
            expect(game.possible_cards).toHaveLength(0)
            expect(game.players).toHaveLength(0)
            expect(game.turn).toBe(1)
            expect(game.ability).toBeNull()
            expect(game.start).toBeTruthy()
            expect(game.drawn).toBeFalsy()
          });
          
        it('should create game with passed parameters', () => {
            game_content = test_data.random_game;
            expect(()=> game = new Game(game_content)).not.toThrow()
            expect(game.cards).toHaveLength(94)
            expect(game.id).toBe('-23323223')
            expect(game.creator).toBe('devich')
            expect(game.drawn).toBeFalsy()
            expect(game.started).toBeTruthy()
            expect(game.ability).toBeNull()
            expect(game.last_card.content == '0' && game.last_card.type == 'b').toBeTruthy()
            expect(game.possible_cards).toHaveLength(3)
            expect(game.players).toHaveLength(2)
            expect(game.players[0].cards.length == 7 && game.players[1].cards.length == 7).toBeTruthy()
        });
        
        it('should error if not passing id and username of creator', () => {
            expect(()=>new Game({})).toThrow('Id and username of creator are necessary.')
        }); 
    });

    describe('#game_start()', () => {
        let game, game_content = test_data.prepared_game
        beforeEach(()=>
        {
            expect(()=> game = new Game(game_content)).not.toThrow()
        })
        it('should start game', () => {
            expect(game.started).toBeFalsy()
            expect(game.players).toHaveLength(2)
            expect(()=>game.start()).not.toThrow()

            expect(game.started).toBeTruthy()
            expect(game.cards).toHaveLength(93)
            game.players.forEach((player)=>
            {
                expect(player.cards).toHaveLength(7)
            })
            expect(game.last_card).toBeDefined()
            expect(game.now_player()).toBe(game.players[game.now])
            expect(game.possible_cards).toBeDefined()
        });

        it('should error if started with less than 2 players', () => {
            expect(game.started).toBeFalsy()
            expect(game.players).toHaveLength(2)
            game.players.splice(0,1)

            expect(()=>game.start()).toThrow('NOT_ENOUGH_PLAYERS')
            expect(game.started).toBeFalsy()
        });
        
        it('should error if game already started', () => {
            expect(game.started).toBeFalsy()
            expect(game.players).toHaveLength(2)
            game.started = true

            expect(()=>game.start()).toThrow('GAME_ALREADY_STARTED')
            expect(game.started).toBeTruthy()

        });

        it('should not start with a special card', () => {
            expect(game.started).toBeFalsy()
            expect(()=>game.start()).not.toThrow()
            expect(game.last_card.is_special_card()).toBeFalsy()
        });
        
        
        
    });
    
    describe('#change turn', () => {
        let game, game_content = test_data.three_players_game
        beforeEach(()=>
        { 
            expect(()=> game = new Game(game_content)).not.toThrow() 
        })

        it('should change turn correctly', () => {
            expect(game.started).toBeTruthy()
            expect(game.players).toHaveLength(3)

            game.now = 0
            game.next()
            expect(game.now).toBe(1)

            game.now = 2
            game.next()
            expect(game.now).toBe(0)

            game.turn*=-1
            game.now = 0
            game.next()
            expect(game.now).toBe(2)

            game.next()
            expect(game.now).toBe(1)

            game.now = 4
            expect(()=>game.next()).not.toThrow()
        });

        it('should error if game not started', () => {
            game.started = false
            expect(()=>game.next()).toThrow('GAME_NOT_STARTED')
        });
        
    });
    
    describe('#play', () => {
        let game, game_content = test_data.random_no_cards
        beforeEach(()=>
        { 
            expect(()=> game = new Game(game_content)).not.toThrow() 
        })
        it('should error if user does not have the played card in hand', () => {
            const curr = game.now_player();

            curr.cards.push(create_card(Values.SIX, Types.BLUE))
            game.possible_cards = [create_card(Values.SEVEN, Types.BLUE)]

            expect(()=> game.put_card(game.possible_cards[0].light)).toThrow(/Player doesnt have/);
            
        });

        it('should error if the card on discard pile does not match with played card', () => {
            const curr = game.now_player();
            game.last_card = create_card(Values.ZERO, Types.BLUE)
            const greenThree = create_card(Values.THREE, Types.GREEN);
            const redOne = create_card(Values.ONE, Types.RED);
            const yellowTwo = create_card(Values.TWO, Types.YELLOW);
    
            curr.cards = [greenThree, redOne, yellowTwo];
            game.add_possible(false)

            curr.cards.forEach(card=>
                {
                    expect(game.check_possible(card)).toBeFalsy();
                    expect(() => game.put_card(card.light)).toThrow('NOT_POSSIBLE_CARD');
                })
        
            // don't touch player's hand
            expect(curr.cards).toHaveLength(3);
            
        });

        it('should remove played card from player hand', ()=> {
            game.last_card = create_card(Values.SIX, Types.BLUE) 
            const curr = game.now_player();
            const last_card = game.last_card
    
            const player_card = create_card(
                last_card.content,
                last_card.type == Types.BLUE ? Types.RED : Types.BLUE,
              );

            curr.cards = [player_card];
    
            game.add_possible(false)
    
            expect(() => game.put_card(player_card.light)).not.toThrow();
            expect(curr.cards).toHaveLength(0);
            expect(curr.cards).not.toContain(player_card);
            expect(curr.cards.indexOf(player_card)).toBe(-1);
    
            // discarded card must be equal to player card now
            expect(game.last_card.content === player_card.content).toBe(true);
            expect(game.last_card.type === player_card.type).toBe(true);
          });
        
          it('should pass turn to next player', ()=> {
                game.last_card = create_card(Values.SIX, Types.BLUE) 
                const curr = game.now_player();
                const last_card = game.last_card
        
                const player_card = create_card(
                    last_card.content,
                    last_card.type == Types.BLUE ? Types.RED : Types.BLUE,
                    );
    
                curr.cards = [player_card];
        
                game.add_possible(false)
    
            expect(game.check_possible(player_card)).toBe(true);
    
            expect(game.now_player().username).toBe(curr.username);
            expect(() => game.put_card(player_card.light)).not.toThrow();
            expect(game.now_player().username).not.toBe(curr.username);
          });

          it('should skip next player if thrown SKIP', function() {
              expect(()=> game = new Game(test_data.custom_config_game)).not.toThrow()
             const curr = game.now_player();
             const next = game.players[1];
             const last_card = game.last_card;
             const skip = create_card(Values.SKIP, last_card.type);
      
            curr.cards = [skip];
            game.add_possible(false)
    
            expect(game.now_player().username).toBe(curr.username);
            expect(()=> game.put_card(skip.light)).not.toThrow();
            expect(game.now_player()).not.toBe(next);
            expect(game.now_player()).toBe(curr);
          });

          it('should change the playing direction if thrown REVERSE', ()=> {
            expect(()=> game = new Game(test_data.three_players_game_with_cards)).not.toThrow()
            game.now = 0
            const curr = game.now_player();
            const next = game.players[1];
            const last_card = game.last_card;
            const reverse = create_card(Values.REVERSE, last_card.type);
            curr.cards = [...curr.cards, reverse];
            game.add_possible(false)
    
            expect(game.now_player().username).toBe(curr.username);
            console.log('LAST_CARD'. last_card)
            expect(() => game.put_card(reverse.light)).not.toThrow();
            expect(game.now_player()).not.toBe(next);
            expect(game.now_player()).not.toBe(curr);
            expect(game.now_player()).toBe(game.players[2]);
          });

          it('should add 2 cards to next player after a DRAW TWO', function() {
            expect(()=> game = new Game(test_data.three_players_game_with_cards)).not.toThrow()
            game.now = 0
            const curr = game.now_player();
            const next = game.players[1];
            const oldLength = next.cards.length;
            const last_card = game.last_card;
            const drawTwo = create_card(Values.DRAW_TWO, last_card.type);
            curr.cards = [...curr.cards, drawTwo];
            game.add_possible(false)
    
            expect(() => game.put_card(drawTwo.light)).not.toThrow();
            expect(game.now_player()).not.toBe(curr);
            expect(game.now_player()).toBe(next);
            expect(game.used_cards).toHaveLength(1)
            expect(game.cards).toHaveLength(2)
            expect(()=> game.pass(true)).not.toThrow()
            expect(game.cards).toHaveLength(0)
            expect(game.used_cards).toHaveLength(1)
            expect(game.now_player()).not.toBe(curr);
            expect(game.now_player()).not.toBe(next);
            expect(game.now_player()).toBe(game.players[2]);
            expect(next.cards).toHaveLength(oldLength + 2);
          });


          it('should inform about changing color after putting wild_card', () => {
            expect(()=> game = new Game(test_data.three_players_game_with_cards)).not.toThrow()
            game.now = 0
            const curr = game.now_player()
            const wild_card = create_card(Values.WILD, Types.WILD)
            curr.cards = [...curr.cards, wild_card];
            const oldLength = curr.cards.length
            game.add_possible(false)
            let result;
            expect(()=>result = game.put_card(wild_card.light)).not.toThrow()
            expect(game.now_player()).toBe(curr)
            expect(curr.cards).toHaveLength(oldLength-1)
            expect(game.last_card).toStrictEqual(wild_card)
            //Inform about change color
            expect(result.change_color).toBeTruthy()
          });

          it('should inform about possibility to challenge after putting wild_draw_four_card and setting color', () => {
            expect(()=> game = new Game(test_data.three_players_game_with_cards)).not.toThrow()
            game.now = 0
            const curr = game.now_player()
            const next = game.players[1]
            const wild_draw_four_card = create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR)
            curr.cards = [...curr.cards, wild_draw_four_card];
            game.add_possible(false)

            let result;
            expect(()=>result = game.put_card(wild_draw_four_card.light)).not.toThrow()
            expect(game.now_player()).toBe(curr)
            expect(game.last_card).toStrictEqual(wild_draw_four_card)

            //Inform about change color
            expect(result.change_color).toBeTruthy()

            expect(()=>game.set_color('orange')).toThrow('Invalid color.')
            expect(()=> result = game.set_color('r')).not.toThrow()

            //Inform about challenge
            expect(result.can_call_bluff).toBeTruthy()

          });
          
          
        
    });

    describe('#pass', () => {
         let game, game_content;
         beforeEach(()=>
         {
             expect(()=>game = new Game(test_data.three_players_game_with_cards)).not.toThrow()
         })
        it('should draw 1 card before passing and maintain current turn', () => {
            const curr = game.now_player()
            const oldLength = curr.cards.length
            console.log(oldLength);
            game.pass(false)
            expect(game.now_player()).toBe(curr)
            expect(curr.cards).toHaveLength(oldLength+1)
        });


        it('should pass the play to the next player', () => {
            game.now = 0
            const curr = game.now_player()
            const next = game.players[1]
            const oldLength = curr.cards.length
            expect(()=>game.pass(false)).not.toThrow()
            expect(game.now_player().username).toBe(curr.username)
            expect(curr.cards).toHaveLength(oldLength+1)
            
            //Pass
            expect(()=>game.pass(true)).not.toThrow()
            expect(game.now_player()).toBe(next)
            expect(curr.cards).toHaveLength(oldLength+1)
            
        });
        
        
        
    });


    describe('#set_color()', () => {
        let game;
        beforeEach(()=>
        {
            expect(()=>game = new Game(test_data.set_color_data)).not.toThrow()
        })
        it('should set current wild card color', () => {
            
            const color = 'r'
            const wild_card = create_card(Values.WILD, Types.WILD)
            game.last_card = wild_card
            const possible_cards = [create_card(Values.SIX, color),create_card(Values.REVERSE, color)]
            let next = game.players[1]
            next.cards = [...next.cards, ...possible_cards]

            expect(()=>game.set_color(color)).not.toThrow()
            expect(game.now_player()).toBe(next)
            expect(game.last_card.color).toBe(color)
            console.log(game.possible_cards)

                possible_cards.forEach(card=>
                {
                    expect(game.possible_cards).toContain(card)

                })
        });

        it('should set current wild_draw_four_card color', () => {
              //WILD_DRAW_FOUR
              const color = 'r'
              const wild_draw_four_card = create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR)
              game.last_card = wild_draw_four_card
              const next = game.players[1]
              next.cards = [...next.cards, create_card(Values.SIX, color)]
              expect(()=>game.set_color(color)).not.toThrow()
              expect(game.now_player()).toBe(next)
              expect(game.last_card.color).toBe(color)
  
              //WILD_DRAW_FOUR allows only challenge or skip
              expect(game.possible_cards).toHaveLength(0)
        });

        it('should error if invalid color', () => {
            const color = 'orange'
            const wild_card = create_card(Values.WILD, Types.WILD)
            game.last_card = wild_card
            expect(()=>game.set_color(color)).toThrow('Invalid color.')
        });
        

        it('should error if changing color of non-wild card', () => {
            const color = 'r'
            const six_blue = create_card(Values.SIX, Types.BLUE)
            game.last_card = six_blue
            expect(()=>game.set_color(color)).toThrow('Only wild cards can have theirs colors changed.')
        });
          
    });
    
    describe('#call_bluff()', () => {
        let game;
        beforeEach(()=>
        {
            expect(()=>game = new Game(test_data.wild_draw_ready_data)).not.toThrow()
        })
        

    it('should draw 4 cards if curr player doesnt challenge', () => {
        const curr = game.now_player()
        const prev = game.prev_player()
        const currOldLength = curr.cards.length
        const prevOldLength = prev.cards.length
        console.log(game.last_card)
        expect(()=>game.check_honest(false)).not.toThrow()
        console.log(game.last_card)
        expect(curr.cards).toHaveLength(currOldLength+4)
        expect(prev.cards).toHaveLength(prevOldLength)
        expect(game.now_player()).toBe(prev)
    });

    it('should draw 6 cards to challenging player if prev player didnt bluff', () => {
        const color = game.last_card.color
        const curr = game.now_player()
        const prev = game.prev_player()
        const currOldLength = curr.cards.length
        const prevOldLength = prev.cards.length
        prev.cards = prev.cards.map(card=>card.type = card.type = color ? Types.GREEN : card.type)
        expect(()=>game.check_honest(true)).not.toThrow()
        expect(curr.cards).toHaveLength(currOldLength+6)
        expect(prev.cards).toHaveLength(prevOldLength)
        expect(game.now_player()).toBe(prev)
    });

    it('should draw 4 cards to prev player if bluff', () => {
        const color = game.last_card.color
        const curr = game.now_player()
        const prev = game.prev_player()
        prev.cards = [...prev.cards, create_card(Values.SIX, color)]
        const currOldLength = curr.cards.length
        const prevOldLength = prev.cards.length
        expect(()=>console.log(game.check_honest(true))).not.toThrow()
        expect(curr.cards).toHaveLength(currOldLength)
        expect(prev.cards).toHaveLength(prevOldLength + 4)
        expect(game.now_player()).toBe(curr)
    });

    


    });
    describe('#additional test-cases', () => {
        let game;
        beforeEach(()=>
        {
            expect(()=>game = new Game(test_data.wild_data)).not.toThrow()
        })
        it('testing wild_draw_four_card process with skip challenge', () => {
            const color = 'b'
        const curr = game.now_player()
        let result;
        const next = game.players[1]
        const oldLength = next.cards.length
    
        const wild_draw_four_card = create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR)
        const six_blue = create_card(Values.SIX, color)
        game.last_card = six_blue
        curr.cards = [...curr.cards, wild_draw_four_card, six_blue]

        game.add_possible(false)

        expect(()=>result = game.put_card(wild_draw_four_card.light)).not.toThrow()
        expect(result.change_color).toBeTruthy()
        expect(game.now_player()).toBe(curr)

        expect(()=>game.set_color(color)).not.toThrow()
        expect(game.now_player()).toBe(next)

        //Only challenge or skip
        expect(game.possible_cards).toHaveLength(0)
        
        expect(()=>result = game.check_honest(false)).not.toThrow()
        expect(game.now_player()).toBe(curr)
        expect(next.cards).toHaveLength(oldLength+4)
        expect(result.prev_player).toBe(curr)
        expect(result.bluffed).toBeUndefined()

        expect(game.possible_cards.length).toBeGreaterThanOrEqual(1)
        expect(game.possible_cards).toContain(six_blue)
        });
        
        it('testing wild_draw_four_card process with failed call_bluff', () => {
            const color = 'b'
        const curr = game.now_player()
        let result;
        const next = game.players[1]
        const oldLength = next.cards.length
    
        const wild_draw_four_card = create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR)
        const six_blue = create_card(Values.SIX, color)
        game.last_card = six_blue
        curr.cards = [...curr.cards, wild_draw_four_card]

        game.add_possible(false)

        expect(()=>result = game.put_card(wild_draw_four_card.light)).not.toThrow()
        expect(result.change_color).toBeTruthy()
        expect(game.now_player()).toBe(curr)

        expect(()=>game.set_color(color)).not.toThrow()
        expect(game.now_player()).toBe(next)

        //Only challenge or skip
        expect(game.possible_cards).toHaveLength(0)
        
        curr.cards = curr.cards.map(card=> card.type = card.type == color ? Types.GREEN : card.type)
        expect(()=>result = game.check_honest(false)).not.toThrow()
        expect(game.now_player()).toBe(curr)
        expect(next.cards).toHaveLength(oldLength+4)
        expect(result.prev_player).toBe(curr)
        expect(result.bluffed).toBeFalsy()

        expect(game.possible_cards).toHaveLength(0)
        });
    });
    
    
});
