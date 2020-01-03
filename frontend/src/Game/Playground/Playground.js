import React, { Component } from 'react';
import './Playground.css';
import autoBind from "react-autobind/src/autoBind";
import * as gameSelectors from "../../store/game/reducer";
import { connect } from 'react-redux';
import connection from '../../services/websocket/websocket';

class Playground extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

    }

    onStart(){
        if(this.props.game.players.length > 1)
        {
            connection.send(JSON.stringify(Object.assign({type: "START_GAME"}, this.props.game)));
        }
        else
        {
            alert('More than 1 player needed');
        }
    }

    render() {
        return(
            <div id = {'playground'}>
                <div id = {'last_card'}>
                    {
                        this.props.game ?   this.props.game.game.lastCard === undefined ?
                            <button id = {'start'} onClick={this.onStart}>Start</button> :
                            <img id={'l_card'} src={this.props.game.game.last_card}/>
                         : 'None'
                    }
                  
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return{
        game: gameSelectors.getGame(state)
    };
}

export default connect(mapStateToProps)(Playground);