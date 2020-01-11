const card_helper = require("./card-helper")
const get_cards = card_helper.get_cards
const create_card = card_helper.create_card
const create_players = card_helper.create_players
const Values = require("./values")
const Types = require("./types")
const Colors = require("./colors")

const test_data = {

    random_game: {
        id: '-23323223',
        creator: 'devich',
        drawn: false,
        started: true,
        ability: null,
        cards: get_cards(94),
        last_card: create_card(Values.ZERO, Types.BLUE,null, only_id = true),
        possible_cards: get_cards(3),
        players: create_players(amount = 2,card_amount = 7)
    },
    prepared_game: {
        id: '-233232253',
        creator: 'devich',
        started: false,
        players: create_players(amount = 2)
    },
    three_players_game: {
        id: '-233232253',
        creator: 'devich',
        started: true,
        players: create_players(amount = 3)
    },
    three_players_game_with_cards: {
        id: '-233232253',
        creator: 'devich',
        started: true,
        cards: get_cards(2),
        last_card: create_card(Values.FIVE, Types.BLUE, null, true),
        players: create_players(amount = 3, cards_amount = 2)
    },
    set_color_data: {
        id: '-233232253',
        creator: 'devich',
        started: true,
        players: create_players(amount = 2, cards_amount = 2)
    },
    random_no_cards: {
        id: '-23323223',
        creator: 'devich',
        drawn: false,
        started: true,
        ability: null,
        cards: get_cards(10),
        players: create_players(amount = 2,cards_amount = 0)
    },
    random_last_card: {
        id: '-23323223',
        creator: 'devich',
        drawn: false,
        started: true,
        ability: null,
        cards: get_cards(10),
        last_card: create_card(Values.SIX, Types.BLUE, null, true),
        players: create_players(amount = 2,card_amount = 0)
    },
    custom_config_game: {
        id: '-23323223',
        creator: 'devich',
        drawn: false,
        now: 0,
        started: true,
        ability: null,
        last_card: create_card(Values.FIVE, Types.BLUE,null, true),
        players: create_players(amount = 2,card_amount = 0)
    },
    wild_data: {
        id: '-233232253',
        creator: 'devich',
        started: true,
        players: create_players(amount = 2, cards_amount = 2),
        cards: get_cards(10)
    },
    wild_draw_ready_data: {
        id: '-233232253',
        creator: 'devich',
        started: true,
        last_card: create_card(Values.WILD_DRAW_FOUR, Types.WILD_DRAW_FOUR, Colors.BLUE, true),
        ability: 'four',
        players: create_players(amount = 2, cards_amount = 2),
        cards: get_cards(10)
    }
}

module.exports = test_data