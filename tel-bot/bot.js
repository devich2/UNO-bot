const {
    bot,
    loader,
    send
} = require('./index')

const Telegraf = require('telegraf')

const ee = require('events')

const callback = new ee.EventEmitter()

bot.command('new', (ctx) => {
    send({
        type: 'CREATE_GAME',
        game: {
            id: ctx.chat.id,
            player: ctx.from
        }
    })
})

bot.command('join', (ctx) => {
    send({
        type: 'ADD_PLAYER',
        game: {
            id: ctx.chat.id,
            player: ctx.from
        }
    })
})

bot.command('leave', (ctx) => {
    send({
        type: 'DELETE_PLAYER',
        game: {
            id: ctx.chat.id, // Game id
            player: ctx.from // Player id
        }
    })
})

bot.command('start', (ctx) => {
    send({
        type: 'START_GAME',
        game: {
            id: ctx.chat.id,
            player: ctx.from
        }
    })
})

bot.command('game', (ctx) => {
    send({
        type: 'GET_GAME',
        game: {
            id: ctx.chat.id
        }
    })
})

loader.on('GAME', (data) => {
    sendGame(data)
})

bot.on('inline_query', (ctx) => {
    send({
        type: 'GET_CARDS',
        inlineQuery: {
            id: ctx.inlineQuery.id
        },
        player: ctx.from
    })
})

bot.on('callback_query', (ctx) => {
    callback.emit(ctx.callbackQuery.data, ctx)
})

callback.on('get_card', (ctx) => {
    send({
        type: 'GET_CARD',
        callbackQuery: {
            id: ctx.callbackQuery.id
        },
        message: {
            id: ctx.callbackQuery.message.message_id
        },
        chat: {
            id: ctx.callbackQuery.message.chat.id
        },
        game: {
            id: ctx.callbackQuery.message.chat.id,
            player: ctx.from
        }
    })
})

callback.on('pass', (ctx) => {
    send({
        type: 'PASS',
        callbackQuery: {
            id: ctx.callbackQuery.id
        },
        game: {
            id: ctx.callbackQuery.message.chat.id,
            player: ctx.from
        }
    })
})

const setColor = (ctx, color) => {
    send({
        type: 'SET_COLOR',
        color: color,
        game: {
            id: ctx.callbackQuery.message.chat.id,
            player: ctx.from
        }
    })
}

callback.on('red', (ctx) => {
    setColor(ctx, 'r')
})

callback.on('yellow', (ctx) => {
    setColor(ctx, 'y')
})

callback.on('green', (ctx) => {
    setColor(ctx, 'g')
})

callback.on('blue', (ctx) => {
    setColor(ctx, 'b')
})

loader.on('PREPARE_PASS', (data) => {
    const button = Telegraf.Extra.markup((markup) =>
        markup.inlineKeyboard(
            [
                [markup.callbackButton('▶️', 'pass')],
                [markup.switchToCurrentChatButton('🃏', '')]
            ]
        )
    )
    bot.telegram.editMessageReplyMarkup(data.chat.id, data.message.id, null, button.reply_markup)
})

bot.on('chosen_inline_result', (ctx) => {
    if (ctx.chosenInlineResult.result_id.length > 5) {
        send({
            type: 'PUT_CARD',
            player: ctx.from,
            card: {
                id: ctx.chosenInlineResult.result_id.match(/[0-9]+\|(.+)/)[1]
            }
        })
    }
})

loader.on('GOT_CARDS', (data) => {
    const cards = data.cards.map((val, id) => ({
        type: 'sticker',
        id: val.valid ? `${id}|${val.id}` : id,
        sticker_file_id: val.id,
        input_message_content: val.valid ? undefined : {
            message_text: 'WHAT?'
        }
    }))
    bot.telegram.answerInlineQuery(data.inlineQuery.id, cards, {
        cache_time: 0
    })
})

loader.on('NO_CARDS', (data) => {
    console.log('No cards')
})

const sendGame = (data) => {
    text = `Game id: <code>${data.game.id}</code>
Players:
${data.game.players.map((user, key) => `${key == data.game.now.id? '➡️': ' '}<a href="tg://user?id=${user.id}">${user.full_name}</a>`).join('\n')}`
    const button = Telegraf.Extra.markup((markup) =>
        markup.inlineKeyboard(
            [
                [markup.callbackButton('⬇️', 'get_card')],
                [markup.switchToCurrentChatButton('🃏', '')]
            ]
        )
    )
    sendMessage(data, text, button.HTML())
}

loader.on('STARTED_GAME', (data) => {
    bot.telegram.sendSticker(data.game.id, data.game.last_card.id)
    sendGame(data)
})

loader.on('NOT_YOU', (data) => {
    if (data.callbackQuery)
        bot.telegram.answerCbQuery(data.callbackQuery.id, 'Go away!')
})

loader.on('PLAYER_JOINED', (data) => {
    sendMessage(data, 'Player was joined')
})

loader.on('NOT_FOUND_GAME', (data) => {
    sendMessage(data, 'Send /new to start new game')
})

loader.on('NOT_ENOUGH_PLAYERS', (data) => {
    sendMessage(data, 'Not enough players')
})

loader.on('ALREADY_IN_GAME', (data) => {
    sendMessage(data, 'You are already in gaME')
})

loader.on('GAME_CREATED', (data) => {
    bot.telegram.sendMessage(data.id, 'Game was CREATED!!!', Telegraf.Extra.HTML())
})

loader.on('PLAYER_LEFT', (data) => {
    sendMessage(data, 'Player was left')
})

loader.on('WINNER', (data) => {
    sendMessage(data, 'Player win!!!')
})

loader.on('CALLED_BLUFF', (data) => {
    console.log('CALLED_BLUFF', data)
})

loader.on('PASSED', (data) => {
    console.log('PASSED', data)
})

loader.on('PUT_CARD', (data) => {
    if (data.color) {
        const color = (data.color == 'g' && 'GREEN 💚') || (data.color == 'r' && 'RED ❤️') || (data.color == 'y' && 'YELLOW 💛') || (data.color == 'b' && 'BLUE 💙')
        sendMessage(data, `Choosee ${color} color`)
    }
    sendGame(data)
})

loader.on('CHANGE_COLOR', (data) => {
    const button = Telegraf.Extra.markup((markup) =>
        markup.inlineKeyboard(
            [
                [markup.callbackButton('RED ❤️', 'red')],
                [markup.callbackButton('GREEN 💚', 'green')],
                [markup.callbackButton('YELLOW 💛', 'yellow')],
                [markup.callbackButton('BLUE 💙', 'blue')]
            ]
        )
    )
    sendMessage(data, 'Choose color', button)
})

loader.on('GAME_DELETED', (data) => {
    sendMessage(data, 'END')
})

loader.on('FULL_ROOM', (data) => {
    console.log('FULL_ROOM', data)
})

loader.on('GAME_ALREADY_STARTED', (data) => {
    console.log('GAME_ALREADY_STARTED', data)
})

const sendMessage = (data, message, extra) => {
    bot.telegram.sendMessage(data.game.id, message, extra || Telegraf.Extra.HTML())
}

bot.launch()