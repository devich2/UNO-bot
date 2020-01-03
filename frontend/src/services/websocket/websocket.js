

let connection = new WebSocket('ws://localhost:8080/');   //ws://discount-space.herokuapp.com

connection.onopen = function () {
};

connection.onerror = function (error) {
};

export default connection;