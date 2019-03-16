import React from 'react';

import SubmitMessage from './SubmitMessage/';

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            textValue: '',
            messageToChange: [],
            messageChange: false
        }

        this.messagesRef = this.props.firebase.database().ref('messages');
    }

    componentDidMount() {

        this.messagesRef.on('child_added', snapshot => {
            const message = {messages:snapshot.val(), key: snapshot.key};
            this.setState({messages: this.state.messages.concat(message)});
        });

        this.messagesRef.on('child_changed', snapshot => {
            if (this.state.messageChange === true) {
                const newValue = this.state.messages;
                const value = snapshot.val();
                const index = newValue.findIndex( message => { return message.key === this.state.messageToChange.key });
                newValue[index].messages.content = value.content;
                this.setState( prevState => { return {
                    messages: prevState.messages = newValue,
                    messageToChange: [],
                    messageChange: false,
                    textValue: '' 
                }})
            }
        })
    }

    setTextValue = (value) => {
        this.setState( prevState => {return {textValue: prevState.textValue = value}})
    }

    handleTextChange = (e) => {
        const value = e.target.value;
        this.setState( prevState => {
            return { textValue: prevState.textValue = value }
        })
    }

    removeMessage = (key) => {
        const path = this.props.firebase.database().ref('messages/' + key);
        path.once('child_removed', () => {
            this.setState( prevState => {
                return { messages: prevState.messages.filter(message => { return message.key !== key }) }
            })
        })
        path.remove()
    }

    changeContent = (message) => {
        if (this.state.messageChange) {
            this.setState( prevState => { return {
                messageToChange: prevState.messageToChange = [],
                messageChange: prevState.messageChange = false,
                textValue: prevState.textValue = ''
            }})
        } else {
            this.setState( prevState => { return {
                messageToChange: prevState.messageToChange = message,
                messageChange: prevState.messageChange = true,
                textValue: prevState.textValue = message.content
            }})
        }
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
                        handleTextChange={this.handleTextChange}
                        textValue={this.state.textValue}
                        setTextValue={this.setTextValue}
                        messageChange={this.state.messageChange}
                        RoomToChange={this.state.RoomToChange}
					    activeRoom={this.props.activeRoom} 
					    user={this.props.user}
				     />
			    </div>
            )
        }

// render messages if needed values exist

        const completeMessage = [];

        for (let i = 0; i < currentRoomMessages.length; i ++) {
            completeMessage.push({
                key: currentRoomMessages[i].key,
                content: currentRoomMessages[i].messages.content,
                username: currentRoomMessages[i].messages.username,
                sentAt: currentRoomMessages[i].messages.sentAt,
                roomId: currentRoomMessages[i].messages.roomId
                });
        }

        return (
            <section>
                {completeMessage.map( (message, index) => {
                    return (
                            <div className='message' key={index}>
                                <h4 className='username'>{message.username}</h4>
                                <p className='content'>{message.content}</p>
                                <span className='change-sentance' onClick={() => this.changeContent(message)}>Edit</span>
                                <span className='remove-sentance' onClick={ () => this.removeMessage(message.key)}>Delete</span>
                                <span className='time'>{message.sentAt}</span>
                            </div>
                    )
                })}
                <SubmitMessage 
                    firebase={this.props.firebase}
                    handleTextChange={this.handleTextChange}
                    textValue={this.state.textValue}
                    setTextValue={this.setTextValue}
                    messageChange={this.state.messageChange}
                    messageToChange={this.state.messageToChange}
                    activeRoom={this.props.activeRoom} 
                    user={this.props.user}
                 />
            </section>
        )
    }
}


export default MessageList;