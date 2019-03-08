import React from 'react';

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            signedIn: false
        }
    }

    componentDidMount() {
        this.props.firebase.auth().onAuthStateChanged( user => {
            this.props.signIn(user || '');
        });
    }

    handleSignIn = () => {
        if (!this.state.signedIn) {
            const provider = new this.props.firebase.auth.GoogleAuthProvider();
            this.props.firebase.auth().signInWithPopup( provider );
        }
        if (this.state.signedIn) {
            this.props.firebase.auth().signOut();
        }
        this.setState( prevState => {
            return { signedIn: !prevState.signedIn }
        })
    }

    render() {
        return (
            <div className='user-status'>
            
                {this.state.signedIn && !this.props.user.isAnonymous ? <h3>Welcome {this.props.user.displayName}</h3> :
                 this.props.user.isAnonymous ? <h3>Guest</h3> : <h3>Please Sign In</h3>}

                <button onClick={this.handleSignIn}>{this.state.signedIn ? 'Sign Out' : 'Sign In'}</button>
            </div>

        )
    }

}

export default User;