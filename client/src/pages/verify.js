import React, { Component } from 'react';
import styles from "../styles/register.module.css"

const queryString = require('query-string');


class Verify extends Component {
    constructor(props) {
        super(props);
        
    }

    componentDidMount()
    {
        const parsed = queryString.parse(this.props.location.search);
        fetch('http://' + window.location.hostname + ':9000/users/verify', {
            headers: {
                'Content-type': 'application/json',
              },
            method: 'POST',
            body: JSON.stringify(parsed),
        });
    }
    render() {
        
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Your account is now verified. Login in the top corner</h2>
                </div>
            </div>
        )
    }
}

export default Verify;
