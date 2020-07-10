import React, { Component } from 'react';
import styles from "../styles/forgot.module.css"

const bcrypt = require('../helpers/custom_bcrypt.js')

function makeTempPass(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

class Forgot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            tempPass: '',
            tempPassHash: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            tempPass: makeTempPass(7),
            tempPassHash: bcrypt.hash(this.state.tempPass)
        })

        var x = document.getElementById('hidden');
        x.style.display = 'block';

        fetch('http://' + window.location.hostname + ':9000/users/forgot', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(this.state),
        });
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
                    <h2>Forgot Password</h2>
                    <form onSubmit={this.handleSubmit} noValidate >
                        <div className={styles.email}>
                            <label htmlFor='email'>Email</label>
                            <input type='email' name='email' onChange={this.handleChange} noValidate />
                        </div>
                        <div className={styles.submit}>
                            <button>Reset My Password</button>
                        </div>
                        <div className={styles.hiddenText} id='hidden' style={{ display: 'none' }}>
                            Password reset submitted, you should receive an email soon with a reset link.
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Forgot;