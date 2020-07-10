import React, { Component } from 'react';
import isLoggedIn from '../helpers/is_logged_in';
import styles from "../styles/browse.module.css"
import store from 'store';
const storage = require('../helpers/storage.js');

const queryString = require('query-string');


class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curUser: {
				gender: '',
				age: '',
				sexualPreference: '',
				fame: '',
			},
			searchFor: {
				gender: '',
				maxAge: 0,
				maxFame: 0,
			},
			peopleJSON: [],
			sortBy: 'age'
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		if (!isLoggedIn()) {
			window.location.href = "/login"
		}
		const response = await fetch('http://' + window.location.hostname + ':9000/users/fetchUser', {
			headers: {
				'Content-type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({ username: storage.unhash(store.get('username')) })
		})
		const data = await response.json();
		this.setState({
			curUser: {
				gender: data.gender,
				age: data.age,
				sexualPreference: data.sexualPreference,
				fame: data.fame
			}
		})
		if (data.gender == 0) { //male
			if (data.sexualPreference == 0) { //straight
				this.setState({
					searchFor: { gender: 1 }
				})
			} else if (data.sexualPreference == 1) { //gay
				this.setState({
					searchFor: { gender: 0 }
				})
			} else { //bi
				this.setState({
					searchFor: { gender: 2 }
				})
			}
		} else { //female
			if (data.sexualPreference == 0) { //straight
				this.setState({
					searchFor: { gender: 0 }
				})
			} else if (data.sexualPreference == 1) { //gay
				this.setState({
					searchFor: { gender: 1 }
				})
			} else { //bi
				this.setState({
					searchFor: { gender: 2 }
				})
			}
		}
	}

	async handleSubmit(e) {
		e.preventDefault();
		const response = await fetch('http://' + window.location.hostname + ':9000/users/browseUsers', {
			headers: {
				'Content-type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(this.state)
		})
		const people = await response.json();
		console.log(people)
		this.setState({
			peopleJSON: people
		})
	}

	handleChange = (event) => {
		event.preventDefault();
		let name = event.target.name;
		let value = event.target.value;
		let curUser = this.state.curUser;
		let searchFor = this.state.searchFor;

		this.setState({ curUser, [name]: value });
		this.setState({ searchFor, [name]: value });
	}

	render() {
		let peopleArr = [];
		if (this.state.peopleJSON.length > 0) {
			if (this.state.sortBy == 'age') {
				peopleArr = this.state.peopleJSON.sort((a, b) => a.age < b.age ? 1 : -1).map(function (person) {
					const url = "/profile/" + person.username;
					return (
						<a href={url}>
							<div className={styles.person}>
								{person.username}<br />
								Age: {person.age}<br />
								Fame: {person.fame}<br /><br />
							</div>
						</a>
					);
				});
			} else {
				peopleArr = this.state.peopleJSON.sort((a, b) => a.fame < b.fame ? 1 : -1).map(function (person) {
					const url = "/profile/" + person.username;
					return (
						<a href={url}>
							<div className={styles.person}>
								{person.username}<br />
							Age: {person.age}<br />
							Fame: {person.fame}<br /><br />
							</div>
						</a>
					);
				});
			}
		}
		return (
			<div className={styles.wrapper}>
				<div className={styles.formWrapper}>
					<h2>Browse Users</h2>
					<form onSubmit={this.handleSubmit} >
						<div className={styles.sortBy}>
							<label htmlFor="sortBy">Sort By</label>
							<select value={this.state.sortBy} name='sortBy' onChange={this.handleChange} required>
								<option value="fame">Fame</option>
								<option value="age">Age</option>
							</select>
						</div>
						<div className={styles.fameDiff}>
							<label htmlFor="maxFame">Max Fame</label>
							<input value={this.state.searchFor.fameDiff} type='number' name='fameDiff' onChange={this.handleChange} required />
						</div>
						<div className={styles.ageDiff}>
							<label htmlFor="maxAge">Max Age</label>
							<input value={this.state.searchFor.ageDiff} type='number' name='ageDiff' onChange={this.handleChange} required />
						</div>
						<div className={styles.submit}>
							<button>Save</button>
						</div>
					</form>
				</div>
				<div >
					<h1>Users</h1>
					{peopleArr}
				</div>
			</div>
		)
	}
}

export default Browse;
