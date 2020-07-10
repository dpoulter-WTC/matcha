import React, { Component } from 'react';
import styles from "../styles/register.module.css"
import isLoggedIn from '../helpers/is_logged_in';
import store from 'store';
import nextPath from '../helpers/nextPath';
const storage = require('../helpers/storage.js');

const bcrypt = require('../helpers/custom_bcrypt.js')

const validEmailRegex =
    RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastmessage: [],
            message: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async UNSAFE_componentWillMount() {
        if (!isLoggedIn()) {
            nextPath('/login')
        }
        if (this.props.match.params.username) {
            const response = await fetch('http://' + window.location.hostname + ':9000/chat/recieve', {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ user1: storage.unhash(store.get('username')), user2: this.props.match.params.username })
            })
            const data = await response.json();
            let messages = []
            if (data.length > 0) {
                messages = data.map(function (val) {
                    console.log(val)
                    return (<li>{val.Message}</li>)
                })
            } else {
                messages = []
            }
            this.setState({
                lastmessage: messages
            })

        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log(this.state.message)
        const response = await fetch('http://' + window.location.hostname + ':9000/chat/send', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ user1: storage.unhash(store.get('username')), user2: this.props.match.params.username, message: this.state.message }),
        })
        nextPath('/profile/' + this.props.match.params.username)
    }

    render() {
        const { errors } = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Chat with {this.props.match.params.username}</h2>
                    <div>
                    <label>{this.state.lastmessage}</label>
                    </div>
                    <form onSubmit={this.handleSubmit} >
                        <div className={styles.firstName}>
                            <input type='text' name='chat' onChange={(e) => this.setState({ message: e.target.value })} required />
                        </div>
                        <div className={styles.submit}>
                            <button>Send</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;