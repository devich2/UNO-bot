import React, { Component } from 'react';
import './Login.css';
import ReactDOM from 'react-dom';
import TelegramLoginButton from 'react-telegram-login';
import autoBind from 'react-autobind';
import * as loginActions from '../store/login/actions'
import { connect } from 'react-redux';

class Login extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        ReactDOM.render(
            <TelegramLoginButton dataOnauth={this.handleTelegramResponse} botName="UNOgBot" />,
            document.getElementById('telegramButton')
        );
    }

    handleTelegramResponse = response => {
        this.props.dispatch(loginActions.logIn(response));
    };
  submit()
  {
      
  }
    render() {
        return(
            <div id = {'login'}>
                <div id = {'app'}>
                    <div id = {'form'}>
                        <div id = "greetings">Welcome to UNOgame</div>
                        <div id = "telegramButton" />
                    
                    </div>
                <form onSubmit={this.submit}>
                    <input ref={node => {
            this.input = node
          }}></input>
          <button type ='Submit'>Create user</button>
                </form>
                </div>
                
            </div>
        );
    }
}

export default connect()(Login);