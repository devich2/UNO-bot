let clients = [];
let admin_client = null;

function add_admin(connection)
{
    admin_client = connection;
}
module.exports.add_admin = add_admin;


function push_conn(conn)
{
    clients.push({
        'unknown': conn
      })
}
module.exports.push_conn = push_conn;


function del_conn(conn)
{
    for (let i in clients) {
        for (let key in clients[i]) {
          if (clients[i][key] == conn) {
            clients.splice(i, 1)
          }
        }
      }
}
module.exports.del_conn = del_conn;


function save_connection(conn) {
    for (let i in clients) {
      for (let key in clients[i]) {
        if (clients[i][key] == conn) {
          clients.splice(i, 1);
          let client = {};
          client[data.id] = conn;
          clients.push(client);
        }
      }
    }
  }
  module.exports.save_connection = save_connection;


  function broadcast(data, players) {
    clients.forEach(client => {
      for (let key in client) {
        if (players && players.findIndex(player => player.id == key) != -1) {
          client[key].sendUTF(JSON.stringify(data));
        }
      }
    })
    if (admin_client) admin_client.sendUTF(JSON.stringify(data)); 
  }
  module.exports.send = broadcast;

  
