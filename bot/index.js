const settings = require('./settings')
const db = require('./db')
const Telegraf = require('telegraf')
const {Player, Game} = require('./objects')

const bot = new Telegraf(settings.token)

bot.on('message', (ctx) => {
    const pl = new Player(ctx.from)
    const g = new Game({id: ctx.message.message_id, players: [pl]})
    console.log(g.repr())
    db.save_game(g)
})

bot.launch()