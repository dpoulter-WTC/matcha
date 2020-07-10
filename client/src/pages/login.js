import React, { Component } from 'react';
import styles from "../styles/login.module.css"
import store from 'store';
import nextPath from '../helpers/nextPath';

const bcrypt = require('../helpers/custom_bcrypt.js');
const storage = require('../helpers/storage.js');

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const response = await fetch('http://' + window.location.hostname + ':9000/users/login', {
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(this.state),
        })
        const data = await response.json();
        if (bcrypt.compare(this.state.password, data.password)) {
            if (data.verified === 0) {
                this.setState({
                    error: 'Please verify your account before you can log in'
                });
                var x = document.getElementById('error');
                x.style.display = 'block';
            } else {
                store.set('loggedIn', storage.hash(true));
                store.set('username', storage.hash(this.state.username));
                nextPath('/');
            }
        } else {
            this.setState({
                error: 'Username or Password incorrect.'
            });
            var x = document.getElementById('error');
            x.style.display = 'block';
        }
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit} >
                        <div className={styles.username}>
                            <label htmlFor="username">Username</label>
                            <input type='text' name='username' onChange={this.handleChange} required />
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' onChange={this.handleChange} required />
                        </div>
                        <div className={styles.info}>
                            <small>Forgot Password? <a href="/forgot">Click Here</a></small>
                        </div>
                        <div className={styles.error} id='error' style={{ display: 'none' }}>
                            {this.state.error}
                        </div>
                        <div className={styles.submit}>
                            <button>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;