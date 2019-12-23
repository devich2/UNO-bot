const log = require("./objects");
const readline = require('readline');
const abilities = require('./abilities')
let players = [new log.Player({id: 343, full_name: 'David'}),new log.Player({id: 340, full_name: 'Sonya'})];
let game = new log.Game({id: 3, players: players, });

game.start();
console.log(game.now_player().cards);
// console.log('Last card: ',game.last_card, game.last_card.is_special());
// console.log('Now player: ',game.now_player().repr());
console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));
// console.log(game.players.forEach(player=>console.log(player.repr())));
game.now_player().cards.push(game.cards.splice(game.cards.findIndex(card=> card.content == 'four'),1)[0]);

game.add_possible();
console.log('After calling add possible:', game.possible_cards.map(card=>card.repr()))
console.log(game.last_card);
console.log('Now_player:', game.now_player().repr());
console.dir(game.put_card(game.now_player().cards[7]));
console.log('Now player', game.now_player().repr());
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cheoose color ', (answer) => {
  game.set_color(answer);
  console.log(game.last_card)
  game.ability = abilities['four']();
  console.log('Player who checks honest:', game.now_player().repr());
  console.log(game.check_honest(false));
  console.log('Player after checking honest:', game.now_player().full_name,  game.now_player().cards);
  console.log(game.last_card);
  console.log(game.players.forEach(player=>console.log(player.repr())));
  console.log('Possible cards: ', game.possible_cards.map(card=>card.repr()));
  rl.close();
});
