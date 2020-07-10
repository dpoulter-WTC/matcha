import React, { Component } from 'react';
import styles from "../styles/register.module.css"

const queryString = require('query-string');


class Browse extends Component {
    constructor(props) {
        super(props);
        this.state = {
			gender: '',
            fame: '',
            longitude: '',
            latitude: ''
        };
    }

    componentDidMount()
    {
		if (!isLoggedIn()) {
			window.location.href = "/login"
		  }
		  console.log(JSON.stringify({username: this.props.match.params.username}))
		  if (this.props.match.params.username) {
			const response = await fetch('http://' + window.location.hostname + ':9000/profile/profileinfo', {
			  headers: {
				'Content-type': 'application/json',
				'Accept': 'application/json'
			  },
			  method: 'POST',
			  body: JSON.stringify({username: this.props.match.params.username})
			})
			const data = await response.json();
			const data2 = await response;
			console.log(data2)
			if (data.gender == 0) { //male
				if (data.sexualPreference == 0) { //straight
					this.setState({
						gender: 1
					  })
				} else if (data.sexualPreference == 1) { //gay
					this.setState({
						gender: 0
					  })
				} else { //bi
					this.setState({
						gender: 2
					  })
				}
			} else { //female
				if (data.sexualPreference == 0) { //straight
					this.setState({
						gender: 0
					  })
				} else if (data.sexualPreference == 1) { //gay
					this.setState({
						gender: 1
					  })
				} else { //bi
					this.setState({
						gender: 2
					  })
				}
			}
			this.setState({
			  username: data.username
			})
	  
		  }
		// GET request to fetch users that match:
		// gender, 
		// fame max user's + whatever,
		// at least 1 common tag
		//
		// order by age, location, fame and common tag,
		// filter above GET request based on filter. Age, location, fame, common tag 
        // const parsed = queryString.parse(this.props.location.search);
        // fetch('http://' + window.location.hostname + ':9000/users/browse', {
        //     headers: {
        //         'Content-type': 'application/json',
        //       },
        //     method: 'GET',
        //     body: JSON.stringify(parsed),
        // });
    }
    render() {
        
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Browse Users</h2>
					{
					/* List users with profile URLs */
					<a onClick={event => this.setState({ selected: 'general' })} className={styles.link}>General</a>

					}
                </div>
            </div>
        )
    }
}

export default Verify;
