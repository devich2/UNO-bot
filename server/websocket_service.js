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
  if(conn == admin_client) admin_client = null
  else
  {
    for (let i in clients) {
      for (let key in clients[i]) {
        if (clients[i][key] == conn) {
          clients.splice(i, 1)
        }
      }
    }
  }
}
module.exports.del_conn = del_conn;


function save_connection(data, conn) {
    for (let i in clients) {
      for (let key in clients[i]) {
        if (clients[i][key] == conn) {
          clients[i].renameProperty(key,data.id)
        }
      }
    }
  }
  module.exports.save_conn = save_connection;


  function broadcast(data, players, conn = null) {
    if(players)
    {
      clients.forEach(client => {
        for (let key in client) {
          if (players.findIndex(player => player.id == key) != -1) {
            client[key].sendUTF(JSON.stringify(data));
          }
        }
      })
    }
    else if (conn)
    {
      conn.sendUTF(JSON.stringify(data)); 
    }
    if (admin_client && admin_client != conn) admin_client.sendUTF(JSON.stringify(data)); 
  }
  module.exports.send = broadcast;


  Object.prototype.renameProperty = function (oldName, newName) {
    // Do nothing if the names are the same
    if (oldName === newName) {
        return this;
    }
   // Check for the old property name to avoid a ReferenceError in strict mode.
   if (this.hasOwnProperty(oldName)) {
       this[newName] = this[oldName];
       delete this[oldName];
   }
   return this;
};

  
