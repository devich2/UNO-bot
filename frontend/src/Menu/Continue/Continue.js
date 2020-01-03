import React, { Component } from 'react';
import './Continue.css'
import { connect } from 'react-redux';
import autoBind from "react-autobind";
import * as menuActions from '../../store/menu/actions';
import * as gameSelectors from "../../store/game/reducer";
import * as gameActions from '../../store/game/actions';


class LoadGame extends Component{

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onButtonClick(game) {
        this.props.dispatch(gameActions.joinGame(game));
    }

    closeLoadGame() {
        this.props.dispatch(menuActions.loadGameClose());
    }

    render() {
        return(
            <div id = {'continue'}>
                {!this.props.game ? "No games" : <button id = {'game_list'} onClick={() => this.onButtonClick(this.props.game)}>
                    {this.props.game.name}</button>}
                <button id = {'load_close'} onClick={this.closeLoadGame}>Close</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        game: gameSelectors.getGame(state)
    };
}

export default connect(mapStateToProps)(LoadGame);