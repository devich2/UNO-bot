const client = require('./redis')

const save_game = (game) => {
    console.log('Saved');
    console.log('Game', game)
    client.HMSET(game.id, game.repr(), function(err, res)
    {
    })

}
exports.save_game = save_game
const load_games_by_player_id = (player_id)=>
{
    //console.log(player_id);
return new Promise((resolve, reject) => { 
    let games = [];  
    client.keys("*", function (err, keys) { 
        console.log(keys);
        if(keys == undefined) resolve(games);
        else{
            Promise.all(keys.map(async key => {
                let game =  await load_game(key);
                if(game.players.findIndex((player)=>player.id == player_id) !=-1) games.push(game)
         })).then(v=>{resolve(games)})
        }
     
    });
});
}
exports.load_by_id = load_games_by_player_id

const load_game = (game_id) => new Promise((resolve, reject) => { 
    console.log('Searching',game_id);
    client.HGETALL(game_id, function (err, obj) {
        console.log(err,'', obj);
        if(obj == null) reject('No game with such an id')
        else {resolve(parse(obj))}
    });
})

const parse = (game)=>
{
   game.now = parseInt(game.now);
   console.log('Last_card', game.last_card);
   game.last_card = JSON.parse( game.last_card);
   game.players = JSON.parse( game.players);
   game.turn = parseInt(game.turn);
   game.used_cards = JSON.parse( game.used_cards);
   game.possible_cards = JSON.parse(game.possible_cards);
   game.winner = parseInt(game.winner);
   game.cards = JSON.parse(game.cards);
   return game;

}

exports.load_game = load_game

const delete_game = (game_id)=>
{
    client.HKEYS(game_id, function(err, keys)
    {
        client.HDEL(game_id, keys, function(err, res)
        {
            
        })
    })
}
exports.delete_game = delete_game;

const find_games = (game_id)=>
{
    let id = game_id;
    let games = []; 
    return new Promise((resolve, reject) => { 
        client.keys("*", function (err, keys) { 
            console.log(keys);
            if(keys == undefined) resolve(games);
            else{ 
                console.log('keys',keys);
                keys = keys.filter(key=> key.startsWith(id));
                Promise.all(keys.map(async key => {
                    try{
                        console.log(key);
                        let game =  await load_game(key);
                        games.push(game)
                    }
                    catch (e)
                    {  reject(e) }
                })).then(v=>{resolve(games)})
            }
         
        });
    });
}
exports.find_games = find_games;