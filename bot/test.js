// const log = require("./objects");
// const readline = require('readline');
// const abilities = require('./abilities')
// let players = [new log.Player({id: 343, full_name: 'David'}),new log.Player({id: 340, full_name: 'Sonya'})];
// let game = new log.Game({id: 3, players: players, });
// game.start();
// console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));
// console.log('Last card:',game.last_card);
// console.log('Now player', game.now_player().repr())
// game.put_card(game.possible_cards[0]);
// game.now_player().cards.push(game.cards.splice(game.cards.findIndex(card=> card.content == 'reverse' && card.type == game.last_card.type),1)[0])
// game.add_possible();
// console.log('After adding');
// console.log('Now player', game.now_player().repr())
// console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));
// game.put_card(game.now_player().cards[7])
// console.log('Now player', game.now_player().repr())
// console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));


function s ()
{
return new Promise(res=> {console.log('nice'); res();});
}
s().then(value=>console.log('good'))
console.log('abad');