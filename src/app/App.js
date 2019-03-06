import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/database';

import RoomList from './components/roomList/'

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
  render() {
    return (
      <div>
        <header>
          <h1 className='welcome-text'>Block Chat</h1>
        </header>
        <section className='list-of-rooms'>
        	<RoomList
				firebase={firebase}
			 />
        </section>
      </div>
    );
  }
}

export default App;
