import React from 'react';

const SubmitMessage = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!props.messageChange) {
            const message = {
                content: props.textValue,
                roomId: props.activeRoom.key,
                sentAt: props.firebase.database.ServerValue.TIMESTAMP,
                username: props.user.displayName
            };
            props.firebase.database().ref('messages').push(message);
            props.setTextValue('');

        } else {
            const path = props.firebase.database().ref('messages/' + props.messageToChange.key + '/content');
            path.set(props.textValue);
            props.setTextValue('');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type='text' 
                onChange={props.handleTextChange} 
                value={props.textValue} 
                placeholder='Type Your Message Here'
                />
            <input type='submit' value='Send' />
        </form>
    )

}

export default SubmitMessage;