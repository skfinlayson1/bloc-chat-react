import React from 'react';

class RoomList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rooms: []
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

    render() {
        console.log(this.state.rooms);
        return (
            <section className='all-rooms'>
                {this.state.rooms.map(room => {
                    return (
                        <div className='room' key={room.key}>{room.name}</div>
                    )
                })}
            </section>
        )
    }
}

export default RoomList