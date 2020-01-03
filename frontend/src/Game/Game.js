import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from "react-autobind";
import './Game.css';
import Cards from "./Cards/Cards";
import Players from "./Players/Players";
import Playground from "./Playground/Playground";



class Game extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        return(
            <div id = {'game'}>
                <Playground/>
                <Players/>
                <Cards/>
            </div>
        );
    }
}

export default connect()(Game);