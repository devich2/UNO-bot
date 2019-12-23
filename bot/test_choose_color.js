const log = require("./objects");
const readline = require('readline');
const abilities = require('./abilities')
let players = [new log.Player({id: 343, full_name: 'David'}),new log.Player({id: 340, full_name: 'Sonya'})];
let game = new log.Game({id: 3, players: players, });
game.start();
// console.log('Last card: ',game.last_card, game.last_card.is_special());
// console.log('Now player: ',game.now_player().repr());
console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));
// console.log(game.players.forEach(player=>console.log(player.repr())));
console.log('Last card:',game.last_card);
console.log('Now player', game.now_player().repr())
game.last_card = (game.cards.splice(game.cards.findIndex(card=> card.content == 'color'),1)[0]);
game.set_color('b');
console.log('After setting color');
console.log('Last card:',game.last_card);
console.log('Now player', game.now_player().repr())
console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));