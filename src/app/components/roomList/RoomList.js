import React from 'react';

class RoomList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rooms: [],
            textValue: ''
        }

        this.roomsRef = this.props.firebase.database().ref('rooms');
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            const room = snapshot.val();
            room.key = snapshot.key;
            this.setState({ rooms: this.state.rooms.concat( room ) })
        })
    }

    textChange = (e) => {
        const newText = e.target.value;
        this.setState( prevState => {
            return { textValue: prevState.textValue = newText }})
    }

    handleSubmit(e) {
        e.preventDefault();
        this.roomsRef.push({name: this.state.textValue});
        this.setState( prevState => {
            return {
                textValue: prevState.textValue = ''
            }
       })
    }

    render() {
        return (
            <section className='all-rooms'>
                {this.state.rooms.map(room => {
                    return (
                        <div className='room' key={room.key} onClick={() => this.props.setActiveRoom(room)}>{room.name}</div>
                    )
                })}

                <form className='add-chat-room' onSubmit={(e) => this.handleSubmit(e)}>
                    <input
                        type='text'
                        value={this.state.textValue}
                        onChange={this.textChange}
                        placeholder='Add Chat Room Here'    
                     />

                     <input
                        type='submit'
                        value='Add Chat Room'
                     />
                </form>
                <input type='button' onClick={() => console.log(this.state.rooms)} />
            </section>
        )
    }
}

export default RoomList