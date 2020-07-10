import React, { Component } from 'react';
import styles from "../styles/settings.module.css"
import isLoggedIn from '../helpers/is_logged_in';
import ImageUploader from "react-images-upload";
import '../styles/fileUploader.css'
import store from 'store';
const storage = require('../helpers/storage.js');

const bcrypt = require('../helpers/custom_bcrypt.js');

const validEmailRegex =
    RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: '', //0 for male, 1 for female
            sexualPreference: 'a', //0 for straight, 1 for gay, 2 for bi
            tags: [],
            bio: '',
            errors: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
            },
            errorstate: '',
            selected: 'general',
            pictures: [],
            longitude: '',
            latitude: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.handleChanges = this.handleChanges.bind(this);

    }


    async UNSAFE_componentWillMount() {
        if (!isLoggedIn()) {
            window.location.href = "/login"
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (validateForm(this.state.errors)) {
            const response = await fetch('http://' + window.location.hostname + ':9000/users/settings', {
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
            }
        }
    }

    async getLocation(event) {
        event.preventDefault();
        this.setState({
            latitude: 1,
            longitude: 1
        });
        let data = {}
        navigator.geolocation.getCurrentPosition(
            function (position) {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                console.log("Latitude is :", this.state.latitude);
                console.log("Longitude is :", this.state.longitude);
            },
            async function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
                var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
                const response = await fetch(proxyUrl + 'https://api.ipgeolocationapi.com/geolocate', {
                    headers: {
                        'Content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                    },
                }).then(
                    data = await response.json())
                    .then(
                        await this.setState({
                            latitude: data.geo.latitude,
                            longitude: data.geo.longitude
                        }))
                // this.state.latitude = data.geo.latitude;

            })
        console.log("Latitude is :", this.state.latitude);
        console.log("Longitude is :", this.state.longitude);
        //Do API call to get Geolocation from IP
        //GET https://api.ipgeolocationapi.com/geolocate HTTP/1.1
    }

    handleChange = (event) => {
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        let errors = this.state.errors;

        switch (name) {
            case 'lastName':
                errors.lastName =
                    value.length < 1
                        ? 'Last Name cannot be blank!'
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

    renderGeneral() {
        const { errors } = this.state;
        return (
            <div>
                <h2>Change Details</h2>
                <form onSubmit={this.handleSubmit} >
                    <div className={styles.gender}>
                        <label htmlFor="gender">Gender</label>
                        <select value={this.state.gender} name='gender' onChange={this.handleChange} required>
                            <option value="0">Male</option>
                            <option value="1">Female</option>
                        </select>
                    </div>
                    <div className={styles.sexual}>
                        <label htmlFor="sexual">Sexual Preferance</label>
                        <select value={this.state.sexualPreference} name='sexual' onChange={this.handleChange} required>
                            <option value="2">Bisexual</option>
                            <option value="0">Heterosexual</option>
                            <option value="1">Homosexual</option>
                        </select>
                    </div>
                    <div className={styles.bio}>
                        <label for="bio">Biography:</label>
                        <textarea id="bio" name="bio" rows="4" cols="50">
                        </textarea>
                    </div>
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
                    <div className={styles.email}>
                        <label htmlFor="email">Email</label>
                        <input type='email' name='email' onChange={this.handleChange} required />
                        {errors.email.length > 0 &&
                            <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.error} id='error' style={{ display: 'none' }}>
                        {this.state.errorstate}
                    </div>
                    <div className={styles.submit}>
                        <button>Save</button>
                    </div>
                </form>
                <h2>Location</h2>
                <form onSubmit={this.getLocation} >
                    <div className={styles.submit}>
                        <button>Refresh Location</button>
                    </div>
                </form>
            </div>
        );

    }

    handleChanges(selectorFiles, file_id) {
        var formdata = new FormData();
        if ((selectorFiles[0].type === "image/jpeg") || (selectorFiles[0].type === "image/png") || (selectorFiles[0].type === "image/gif")) {
            formdata.append("picture", selectorFiles[0], selectorFiles[0].name);
            formdata.append("username", storage.unhash(store.get('username')));
            formdata.append("img_pos", file_id);
            console.log(selectorFiles)
            fetch('http://' + window.location.hostname + ':9000/profile/upload', {
                redirect: 'follow',
                method: 'POST',
                body: formdata
            })
        }
    }



    renderProfile() {
        return (
            <div>
                <h2>Change Details</h2>
                <div>
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => this.handleChanges(e.target.files, 5)} />
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => this.handleChanges(e.target.files, 0)} />
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => this.handleChanges(e.target.files, 1)} />
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => this.handleChanges(e.target.files, 2)} />
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => this.handleChanges(e.target.files, 3)} />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.innerWrapper}>
                    <div className={styles.menu}>
                        <a onClick={event => this.setState({ selected: 'general' })} className={styles.link}>General</a>
                        <a onClick={event => this.setState({ selected: 'profile' })} className={styles.link}>Profile</a>

                    </div>
                    <div className={styles.content}>
                        {this.state.selected === 'general' ? this.renderGeneral() : null}
                        {this.state.selected === 'profile' ? this.renderProfile() : null}
                    </div>
                </div>
            </div>
        )

    }
}

export default Settings;