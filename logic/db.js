const client = require('./redis')

const save_game = (game) => {
    client.SET(game.id, JSON.stringify(game.repr()), (err) => {
        if(err) {
            console.log(err); throw new Error('SAVE_GAME_ERROR')
        }
        else console.log('Saved');
    })
}
module.exports.save_game = save_game


const load_games_by_player_id = async(player_id) => 
{
  console.log(typeof(player_id));
  let keys = await get_keys('*');
    return Promise.all(
        keys.map(load_game)).then(games=> games.filter(game=>game.players.findIndex(player=>player.id == player_id)!=-1));
}
module.exports.load_by_id = load_games_by_player_id


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


const find_games = async game_id => 
{
    let keys = await get_keys('*');
   return  Promise.all(
         keys.filter(key => key.startsWith(game_id))
        .map(load_game)
);
}
module.exports.find_games = find_games;


const load_game = (key) => new Promise((resolve, reject) => {
    client.GET(key, function (err, obj) {
        if(err) reject('DATABASE_KEY_ERROR')
        else if (obj == null) reject('NOT_FOUND_GAME')
        else resolve(JSON.parse(obj))
    });
})
module.exports.load_game = load_game

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