import React from 'react';

class RoomList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rooms: [],
            textValue: '',
            changeRoom: false,
            roomToRename: []
        }

        this.roomsRef = this.props.firebase.database().ref('rooms');
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            const room = snapshot.val();
            room.key = snapshot.key;
            this.setState({ rooms: this.state.rooms.concat( room ) })
        })
        this.roomsRef.on('child_changed', snapshot => {
            const index = this.state.rooms.findIndex( room => { return room.key === snapshot.key});
            const replacementValue = snapshot.val();
            const newRooms = this.state.rooms;
            replacementValue.key = snapshot.key;
            newRooms[index] = replacementValue;
            this.setState({ rooms: newRooms });
        })
    }

    textChange = (e) => {
        const newText = e.target.value;
        this.setState( prevState => {
            return { textValue: prevState.textValue = newText }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.changeRoom && this.state.textValue !== '') {
            this.roomsRef.push({name: this.state.textValue});
            this.setState( prevState => {
                return { textValue: prevState.textValue = '' }
           })
        } else if (this.state.changeRoom) {
            const path = this.props.firebase.database().ref('rooms/' + this.state.roomToRename.key + '/name');
            path.set(this.state.textValue);
            this.setState( prevState => {
                return {
                    textValue: prevState.textValue = '', 
                    changeRoom: prevState.changeRoom = false,
                    roomToRename: prevState.roomToRename = [] 
                }
            })
        }
    }

    removeRoom = (key) => {
        const path = this.props.firebase.database().ref('rooms/' + key)
        path.once('child_removed', () => {
            this.setState( prevState => { return {rooms: prevState.rooms.filter( room => { return room.key !== key })} })
        })
        path.remove()
    }

    renameRoom = (room) => {
        if (this.state.changeRoom) {
            this.setState( prevState => {
                return {
                    textValue: prevState.textValue = '', 
                    changeRoom: prevState.changeRoom = false,
                    roomToRename: prevState.roomToRename = [] 
                }
            })
        } else {
            this.setState( prevState => {
                return {
                    textValue: prevState.textValue = room.name, 
                    changeRoom: prevState.changeRoom = true,
                    roomToRename: prevState.roomToRename = room 
                }
            })
        }
    }

    rename = () => {
        if (this.state.changeRoom) {
            return 'Rename'
        }
        if (!this.state.changeRoom) {
            return 'Add Chat Room'
        }
    }

    render() {
        return (
            <section className='all-rooms'>
                {this.state.rooms.map(room => {
                    return (
                        <div className='room' key={room.key}>
                            <h3 onClick={() => this.props.setActiveRoom(room)}>{room.name}</h3>
                            <span className='remove-room' onClick={() => this.removeRoom(room.key)}>Delete</span>
                            <span className='rename-room' onClick={() => this.renameRoom(room)}>Rename</span>
                        </div>
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
                        value={this.rename()}
                     />
                </form>
            </section>
        )
    }
}

export default RoomList