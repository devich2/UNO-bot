const card_deck = require("./uno_cards");
const abilities = require("./abilities")
const possibilities = require("./possibilities")
const Card = require('./card')
const Player = require('./player')

const find_card = (id) => {
    for (let card of card_deck) {
      if (card.light == id) return new Card(card)
    }
  }
const getRandomInt = (min, max)=> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const shuffle = (array)=> {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i + 1)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array;
    }

class Game {
    constructor(dict) {
        this.id = dict.id
        this.now = dict.now || 0
        this.creator = dict.creator
        this.last_card = dict.last_card ? find_card(dict.last_card.id) : null;
        if(dict.last_card && dict.last_card.color) this.last_card.color = dict.last_card.color;
        this.used_cards = dict.used_cards ? dict.used_cards.map(card => find_card(card.id)) :[];
        this.cards = dict.cards ? dict.cards.map(card => find_card(card.id)) : [];
        this.possible_cards = dict.possible_cards ? dict.possible_cards.map(card => find_card(card.id)) : [];
        this.players = dict.players ? dict.players.map(pl => new Player(pl)) : [];
        this.turn = dict.turn || 1 // 1 | -1
        this.winner = dict.winner ? dict.winner : 0; //1 | 0
        this.ability = abilities[dict.ability] ? abilities[dict.ability]() : null;
        this.started = dict.started ? dict.started : false;
    }

    now_player() {
        return this.players[this.now]
    }

    prev_player(){
        if(!this.started) throw new Error('Game not started')
        if(this.players.length <=1) throw new Error('One player in game(needs deleting)')
        let prev;
        let turn = this.now - this.turn
        if (turn < 0) {
           prev = this.players.length + turn
        } else if (turn >= this.players.length) {
           prev = turn - this.players.length
        } else {
           prev = turn
        }
        return this.players[prev];
    }

    repr() {
        return {
            id: this.id,
            now: this.now,
            creator: this.creator,
            last_card: this.last_card && this.last_card.repr(),
            used_cards: this.used_cards.map(card=>card.repr()) ,
            cards: this.cards.map(card => card.repr()) ,
            possible_cards: this.possible_cards.map(card => card.repr()),
            players: this.players.map(player => player.repr()),
            turn: this.turn,
            ability: this.ability ? this.last_card.content : 0,
            winner: this.winner,
            started: this.started
         
        }
    }

    add_player(dict) {
        if (this.players.length > 10) throw new Error('FULL_ROOM');
        let player = new Player(dict); //check 
        this.players.push(player);
        if(this.started) this.players.cards = this.get_start_cards();
    }

    remove_player(dict) //need delete player cards
    {
        let index = this.players.findIndex(player => player.id == dict.id);
        if(index == -1) throw new Error('PLAYER_NOT_FOUND');
        let cards = this.players[index].cards;
        if(cards.length > 0) this.cards = this.cards.concat(cards);
        this.now--;
        return this.players.splice(index, 1)[0];
    }
    next(turns = 1) {
        const turn = this.now + turns * this.turn
        if (turn < 0) {
            this.now = this.players.length + turn
        } else if (turn >= this.players.length) {
            this.now = turn - this.players.length
        } else {
            this.now = turn
        }
    }

    reload_cards() {
        let card_list = shuffle([...this.used_cards]);
        this.used_cards = [];
        this.cards = shuffle(card_list.concat(this.cards));
    }

    get_some_cards(count) {
        let some_cards = [];
        if (this.cards.length < count) {
            this.reload_cards();
        } else if (this.cards.length > count) {
            for (let i = 0; i < count; i++) {
                some_cards.push(this.cards.splice(getRandomInt(0, this.cards.length - 1), 1)[0])
            }
            return some_cards;
        }
    }

    private_draw(player, amount)
    {
        if (!player) throw new Error('Player is mandatory');
        const cards = this.get_some_cards(amount)
        player.cards = player.cards.concat(cards);
    }

    drop(card) {
        this.used_cards.push(new Card(Object.assign({}, this.last_card)));
        console.log('Previous card: ', this.last_card);
        this.last_card = card; //need check
        console.log('New last card', this.last_card);
    }
    get_start_cards() {
        return this.get_some_cards(7);
    }
   
    start() {
        if (this.is_over()) throw new Error('NOT_ENOUGH_PLAYERS')
        else if (this.started)
        {  
            throw new Error('GAME_ALREADY_STARTED');
        }
        else{
            shuffle(card_deck).forEach((card) => {
                for (let i = 0; i < card.quantity; i++) {
                    this.cards.push(new Card(card));
                }
            })
            this.players.forEach(player => {
                 player.cards = this.get_start_cards();
                
            });
             console.log('CARDSFUCK',this.players[0].cards)
            this.players = shuffle(this.players);
            this.now = getRandomInt(0, this.players.length - 1);
            let random_int;
            do {
                random_int = getRandomInt(0, this.cards.length-1) ; //getRandomInt(0, this.cards.length - 1);
                this.last_card = this.cards[random_int];
                console.log('Last card', this.last_card);
                console.log('Id', this.cards[random_int].id)
            }
            while (this.last_card.is_special_card());
            this.cards.splice(random_int, 1);
            console.log('Cards length', this.cards.length);
            console.log('Last after start_game card', this.last_card);
            this.started = true;
            return this.end_turn();
        }  
    }
    add_possible(change_possible) {
        console.log('Added possible', change_possible);
        this.possible_cards = [];
        const last_card = this.last_card;
        let content = last_card.is_special_card() ? last_card.content : 'simple';
        console.log('Last card', last_card, 'Content', content)
        let poss_cards = possibilities[content](last_card,change_possible);
        console.log('Now cards',this.now_player().cards);
        let cards = this.now_player().cards;
        console.log('GOT', poss_cards);
        outer: for (let card of cards) {
            inner: for (let poss = 0; poss < poss_cards.length; poss++ ) {  
                for (let key in poss_cards[poss]) {
                    console.log('HIM', card[key], 'MY',  poss_cards[poss][key])
                    if (card[key] != poss_cards[poss][key]) continue inner;
                }
                console.log('PUSHED');
                this.possible_cards.push(card);
                continue outer;
            }
        }
        if(this.now_player().cards.length == 1)
        {
           this.possible_cards = this.possible_cards.filter(card=>!card.is_wild_card())
        }
        console.log('POSSIBLE CARDS', this.possible_cards)
    }

    check_possible(poss_card) {
        return this.possible_cards.findIndex(card => card.content == poss_card.content && card.type == poss_card.type) == -1 ? false : true;
    }

    check_winner() {
        let res = {};
        if (this.no_cards()) {
            res['winner'] = this.now_player();
            this.remove_player(this.now_player());
        }
        return res;
    }
    put_card(id) {
        let card = find_card(id);
        console.log('Put card:', card);
        let content = card.is_special_card() ? card.content : 'simple';
        if (this.check_possible(card)) { //!
            console.log('Player cards before putting card', this.now_player().cards)
            this.drop(this.now_player().remove_card(card));
            console.log('Player cards after putting card', this.now_player().cards)
            this.ability = abilities[content](this);
            return this.end_turn();
        } else throw new Error('NOT_POSSIBLE_CARD');
    }

    calculate_score() {
        return this.players.map(player => player.cards).reduce((amount, cards) => {
          amount += cards.reduce((s, c) => (s += c.score), 0);
          return amount;
        }, 0);
      }
    
    
    check_honest(check) {
        let result = {}; 
        console.log(this.ability);
        this.ability = this.ability(this,check,result);
        this.end_turn(!result.bluffed);
        return result;
    }
    set_color(color) {

        try{
            this.last_card.set_color(color);
            console.log("COLORS", color, this.last_card.color);
            return Object.assign(this.end_turn() , this.last_card.content == 'four' ? { can_call_bluff: true }: {});
        }
        catch(e)
        {
            console.log(e || e.message)
        }
       
    }
    
    end_turn(next_step = true, change_possible = false)
    {
        console.log(this.last_card);
        if (this.last_card.is_wild_card() && !this.last_card.color) {
            console.log('Not added possible');
            return Object.assign({
                change_color: true
            });
        }
        console.log('Here', next_step);
        let res = Object.assign(this.check_winner(),{over : this.is_over()});
        if(res.over){}
        else
        {
            if (next_step) {
                console.log('Next');
                this.next();
            }
            this.add_possible(change_possible);
        }
        return res;
    }
    pass(skip) {
        let call = this.ability || abilities['draw_one'];
        this.ability = call(this, skip);
        console.log('CURRENT PLAYER CARDS LENGTH FOR PASS',this.now_player().cards.length)
        return this.end_turn(skip, true);
    }
    is_over() {
        return this.players.length <= 1;
    }
    no_cards() {
        return this.now_player().cards.length == 0;
    }
}
module.exports.Game = Game;