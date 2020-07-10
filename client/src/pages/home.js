import React, { Component } from 'react';
import styles from "../styles/home.module.css"

class Home extends Component {
	constructor(props) {
		super(props);

	}

	render() {

		return (
			<div className={styles.background}>
				<div className={styles.content}>

					<div className={styles.header}>
						<div className={styles.headerText}>
						<h1>Welcome to Matcha!</h1>
						</div>
					</div>

					<div className={styles.mainBody}>
						<h1>Taking your relationship to the next level</h1>
						<p>Register now to find your lifelong partner! Or don't, we don't really care.</p>
					</div>
				</div>
			</div>
		)
	}
}

export default Home;
