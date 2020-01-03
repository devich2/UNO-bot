const WebSocket = require('ws');
const ee = require('events')
const Telegraf = require('telegraf')

exports.bot = new Telegraf('744209775:AAGD-ikirLHQ2UP6MCrFI-Z51lPEAgX3rBg')

const url = 'ws://discount-space.herokuapp.com/';

const ws = new WebSocket(url);

const send = (data) => {
    ws.send(JSON.stringify(data))
}

exports.send = send

const loader = new ee.EventEmitter()

ws.on('open', () => {
    console.log('CONNECTED')
    send({type: 'SAVE_CONNECTION', admin: true})    
});

ws.on('message', (data) => {
    const resp = JSON.parse(data)
    console.log('loader', resp)
    loader.emit(resp.type, resp)
});

ws.on('error', () => 
{

    console.log('DISCONNECTED')
});

exports.loader = loader
