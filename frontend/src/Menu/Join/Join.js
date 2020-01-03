import React, { Component } from 'react';
import autoBind from "react-autobind";
import * as menuActions from "../../store/menu/actions";
import { connect } from 'react-redux';
import './Join.css';
import connection from "../../services/websocket/websocket";
import * as loginSelectors from "../../store/login/reducer"

class Join extends Component{
    constructor(props) {
        super(props);
        autoBind(this);
    }

    handleChange(e) {
        console.log(this.props);
        connection.send(JSON.stringify({type: "FIND_GAMES", player: { username: e.target.value}}));
    }
    joinGame(game_id)
    {
        console.log(game_id);
        connection.send(JSON.stringify(Object.assign({type: "ADD_PLAYER"}, {game: {id: game_id, player: this.props.userInfo }})));
    }
    closeLoadGame() {
        this.props.dispatch(menuActions.joinClose());
    }

    render() {
        return(
            <div id = {'join'}>
            <h3>Find a game via a username</h3>
            <input type = 'text' style={{'width': '250px'}} onChange = {this.handleChange} required={true}/><br/>
            {(this.props.userInfo.available_games==undefined || this.props.userInfo.available_games.length ==0 ) ? '' : this.props.userInfo.available_games.map(game=>
            <button className ='offered-game' onClick = {this.joinGame.bind(null,game.id)}>{game.creator}</button>
            )
    }
            <button id = {'load_close'} onClick={this.closeLoadGame}>Close</button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        userInfo:  loginSelectors.getUser(state)
    };
}
export default connect(mapStateToProps)(Join);