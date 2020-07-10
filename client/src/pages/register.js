import React, { Component } from 'react';
import styles from "../styles/register.module.css"
import nextPath from '../helpers/nextPath';

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
            firstName: '',
            lastName: '',
            age: 0,
            username: '',
            email: '',
            password: '',
            errors: {
                firstName: '',
                lastName: '',
                age: '',
                username: '',
                email: '',
                password: '',
            },
            errorstate: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {

    }

    async handleSubmit(e) {
        e.preventDefault();
        this.state.password = bcrypt.hash(this.state.password)
        if (validateForm(this.state.errors)) {
            const response = await fetch('http://' + window.location.hostname + ':9000/users/register', {
                headers: {
                    'Content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(this.state),
            })
            const errCode = await response;
            const data = await response.json();
            if (errCode.status === 500) {
                this.setState({
                    errorstate: data.res
                })
                var x = document.getElementById('error');
                x.style.display = 'block';
            } else {
                nextPath('/registered')
            }
        }
       
    }

    handleChange = (event) => {
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        let errors = this.state.errors;

        switch (name) {
            case 'firstName':
                errors.firstName =
                    value.length < 1
                        ? 'First Name cannot be blank!'
                        : '';
                break;
            case 'lastName':
                errors.lastName =
                    value.length < 1
                        ? 'Last Name cannot be blank!'
                        : '';
                break;
            case 'age':
                errors.age =
                    value < 18
                        ? 'You must be at least 18 to register!'
                        : value > 122
                            ? 'The oldest recorded person was 122. Nice try.'
                            : '';
                break;
            case 'username':
                errors.username =
                    value.length < 6
                        ? 'Username must be 6 characters long!'
                        : '';
                break;
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? ''
                        : 'Email is not valid!';
                break;
            case 'password':
                errors.password =
                    value.length < 6
                        ? 'Password must be 6 characters long!'
                        : '';
                break;
            default:
                break;
        }

        this.setState({ errors, [name]: value });
    }

    render() {
        const { errors } = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Register</h2>
                    <form onSubmit={this.handleSubmit} >
                        <div className={styles.firstName}>
                            <label htmlFor="firstName">First Name</label>
                            <input type='text' name='firstName' onChange={this.handleChange} required />
                            {errors.firstName.length > 0 &&
                                <span className={styles.error}>{errors.firstName}</span>}
                        </div>
                        <div className={styles.lastName}>
                            <label htmlFor="lastName">Last Name</label>
                            <input type='text' name='lastName' onChange={this.handleChange} required />
                            {errors.lastName.length > 0 &&
                                <span className={styles.error}>{errors.lastName}</span>}
                        </div>
                        <div className={styles.age}>
                            <label htmlFor="age">Age</label>
                            <input type='number' name='age' onChange={this.handleChange} required />
                            {errors.age.length > 0 &&
                                <span className={styles.error}>{errors.age}</span>}
                        </div>
                        <div className={styles.username}>
                            <label htmlFor="username">Username</label>
                            <input type='text' name='username' onChange={this.handleChange} required />
                            {errors.username.length > 0 &&
                                <span className={styles.error}>{errors.username}</span>}
                        </div>
                        <div className={styles.email}>
                            <label htmlFor="email">Email</label>
                            <input type='email' name='email' onChange={this.handleChange} required />
                            {errors.email.length > 0 &&
                                <span className={styles.error}>{errors.email}</span>}
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' onChange={this.handleChange} required />
                            {errors.password.length > 0 &&
                                <span className={styles.error}>{errors.password}</span>}
                        </div>
                        <div className={styles.info}>
                            <small>Username and password must be at least six characters in length.</small>
                        </div>
                        <div className={styles.error} id='error' style={{ display: 'none' }}>
                            {this.state.errorstate}
                        </div>
                        <div className={styles.submit}>
                            <button>Create</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;