import React from 'react';

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
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

        const currentRoomMessages = this.state.messages.filter( message => {
            return this.props.activeRoom.key === message.key;
        })

// If no messages exist show this default screen

        if (currentRoomMessages.length === 0) {
            return (
                <h1>Be the first to write a message</h1>
            )
        }

        const completeMessage = [];
        const location = currentRoomMessages[0].messages;

        for (let key in location) {
            completeMessage.push(
                {
                content: location[key].content,
                username: location[key].username,
                time: location[key].sentAt,
                roomId: location[key].roomId
                }
            );
        }

// render messages if needed values exist

        return (
            <section>
                {completeMessage.map( (message, index) => {
                    return (
                        <div className='message' key={index}>
                            <h4 className='username'>{message.username}</h4>
                            <p className='content'>{message.content}</p>
                            <span className='time'>{message.time}</span>
                        </div>
                    )
                })}
            </section>
        )
    }
}

export default MessageList;