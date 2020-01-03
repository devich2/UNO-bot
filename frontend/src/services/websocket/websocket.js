

let connection = new WebSocket('ws://discount-space.herokuapp.com/');   //ws://discount-space.herokuapp.com

connection.onopen = function () {
};

connection.onerror = function (error) {
};

export default connection;