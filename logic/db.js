const client = require('./redis')

//#Save game in redis-db
const save_game = (game) => {
    client.SET(game.id, JSON.stringify(game.repr()), (err) => {
        if(err) {
            console.log(err); throw new Error('SAVE_GAME_ERROR')
        }
        else console.log('Saved');
    })
}
module.exports.save_game = save_game


//#Get array of games,which player is currently in
const load_games_by_player_id = async(player_id) => 
{
  console.log(player_id);
  let keys = await get_keys('*');
    return Promise.all(
        keys.map(load_game)).then(games=> games.filter(game=>game.players.findIndex(player=>player.id == player_id)!=-1));
}
module.exports.load_by_id = load_games_by_player_id


//#Delete game by game id
const delete_game = async(game_id) => {
    let keys = await get_keys(game_id);
    if(keys == []) throw new Error('NOT_FOUND_GAME')
    client.DEL(keys[0], function(err)
          {
            if(err) throw new Error('DELETE_GAME_ERROR')
          }
    )
}
module.exports.delete_game = delete_game;


//#Get array of games by username of creator
const find_games = async username => 
{
   let keys = await get_keys('*');
   return  Promise.all(
         keys.map(load_game)).then(games=> games.filter(game=>game.creator.startsWith(username)));
}
module.exports.find_games = find_games;


//#Get game by game id
const load_game = (key) => new Promise((resolve, reject) => {
    client.GET(key, function (err, obj) {
        console.log('KEY', key);
        if(err) reject('DATABASE_KEY_ERROR')
        else if (obj == null) reject('NOT_FOUND_GAME')
        else resolve(JSON.parse(obj))
    });
})
module.exports.load_game = load_game


//#Get redis-keys
const get_keys = (key) => new Promise((resolve, reject) => {
    client.keys(key, function (err, keys) {
        if(err) 
        {
            console.log(err);
            reject('DATABASE_KEYS_ERROR');
        }
        else if (keys == undefined) resolve([]);
        else resolve(keys);
    });
});