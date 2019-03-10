import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import RoomList from './components/RoomsList/';
import MessageList from './components/MessageList/';
import User from './components/User/';

// Initialize Firebase
var config = {
		apiKey: "AIzaSyDJlhfse76-L63QPA0dzReVE6EabcXwmFs",
		authDomain: "bloc-chat-react-2001.firebaseapp.com",
		databaseURL: "https://bloc-chat-react-2001.firebaseio.com",
		projectId: "bloc-chat-react-2001",
		storageBucket: "bloc-chat-react-2001.appspot.com",
		messagingSenderId: "999985957088"
};
firebase.initializeApp(config);

class App extends Component {

	constructor() {
		super();
		this.state = {
			activeRoom: false,
			user: ''
		}
	}

	setActiveRoom = (room) => {
		this.setState( prevState => {
			return { activeRoom: prevState.activeRoom = room }
		})
	}

	signIn = (name) => {
		this.setState( prevState => {
			return {user: prevState.user = name}
		})
	}

  render() {
    return (
      <div>
        <header>
          <h1 className='welcome-text'>Block Chat</h1>
					<User
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						signIn={this.signIn}
						user={this.state.user}
					 />
        </header>
        <section className='list-of-rooms'>
        	<RoomList
						firebase={firebase}
						setActiveRoom={this.setActiveRoom}
					 />
        </section>
				<section className='list-of-messages'>
					<MessageList
						firebase={firebase}
						activeRoom={this.state.activeRoom}
						user={this.state.user}
					 />
				</section>
      </div>
    );
  }
}

export default App;
