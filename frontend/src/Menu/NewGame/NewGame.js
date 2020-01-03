import React, { Component } from 'react';
import './NewGame.css';
import autoBind from "react-autobind";
import * as menuActions from '../../store/menu/actions';
import { connect } from 'react-redux';
import connection from '../../services/websocket/websocket';
import * as loginSelectors from "../../store/login/reducer";


class NewGame extends Component{
    constructor(props) {
        super(props);
        autoBind(this);
    }

    close() {
        this.props.dispatch(menuActions.newGameClose());
    }

    render() {
        return(
        <div id = {'newgame'}>
                <h3>...Loading</h3>
                <button onClick={this.close} style={{'marginTop': '20px'}}>Close</button>
        </div>
        );
    }
}

export default connect()(NewGame);