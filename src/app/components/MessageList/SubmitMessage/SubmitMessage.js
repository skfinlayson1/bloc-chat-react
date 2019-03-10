import React from 'react';

class SubmitMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const content = this.state.textValue;
        const roomId = this.props.activeRoom.key;
        const sentAt = this.props.firebase.database.ServerValue.TIMESTAMP
        const username = this.props.user.displayName;
        const message = {content: content, roomId: roomId, sentAt: sentAt, username: username};
        const location = this.props.firebase.database().ref('messages');
        location.push(message);
        this.setState({textValue: ''});
    }

    handleTextChange = (e) => {
        const value = e.target.value;
        this.setState( prevState => {
            return { textValue: prevState.textValue = value }
        })
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input 
                    type='text' 
                    onChange={this.handleTextChange} 
                    value={this.state.textValue} 
                    placeholder='Type Your Message Here'
                    />
                <input type='submit' value='Send' />
            </form>
        )
    }

}

export default SubmitMessage;