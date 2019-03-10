import React from 'react';

import SubmitMessage from './SubmitMessage/';

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            textValue: ''
        }

        this.messagesRef = this.props.firebase.database().ref('messages');
    }

    componentDidMount() {
        this.messagesRef.on('child_added', snapshot => {
            const message = {messages:snapshot.val(), key: snapshot.key};
            this.setState({messages: this.state.messages.concat(message)});
        })
    }

    render() {

// If no room is selected show this default screen

        if (!this.props.activeRoom) {
            return (
                <h1>Select a room to view the conversation!</h1>
            )
        }

// If no messages exist show this default screen

        const currentRoomMessages = this.state.messages.filter( message => {
            return this.props.activeRoom.key === message.messages.roomId;
        })

        if (currentRoomMessages.length === 0) {
            return (
                <div>
                    <h1>Be the first to write a message</h1>
				    <SubmitMessage 
					    firebase={this.props.firebase} 
					    activeRoom={this.props.activeRoom} 
					    user={this.props.user}
                        handleSubmit={this.handleSubmit}
                        handleTextChange={this.handleTextChange}
                        textValue={this.state.textValue}
				     />
			    </div>
            )
        }

// render messages if needed values exist

        const completeMessage = [];

        for (let i = 0; i < currentRoomMessages.length; i ++) {
            completeMessage.push(
                {
                content: currentRoomMessages[i].messages.content,
                username: currentRoomMessages[i].messages.username,
                sentAt: currentRoomMessages[i].messages.sentAt,
                roomId: currentRoomMessages[i].messages.roomId
                }
            );
        }

        return (
            <section>
                {completeMessage.map( (message, index) => {
                    return (
                            <div className='message' key={index}>
                                <h4 className='username'>{message.username}</h4>
                                <p className='content'>{message.content}</p>
                                <span className='time'>{message.sentAt}</span>
                            </div>
                    )
                })}
                <SubmitMessage 
                    firebase={this.props.firebase} 
                    activeRoom={this.props.activeRoom} 
                    user={this.props.user}
                    handleSubmit={this.handleSubmit}
                    handleTextChange={this.handleTextChange}
                    textValue={this.state.textValue}
                 />
            </section>
        )
    }
}


export default MessageList;