import React, { Component } from 'react';
import styles from "../styles/register.module.css"


class Registered extends Component {
    constructor(props) {
        super(props);
        
    }
    render() {
        
        return (
            <div className={styles.wrapper}>
                <div className={styles.formWrapper}>
                    <h2>Your account is now registered. Check your emails to verify</h2>
                </div>
            </div>
        )
    }
}

export default Registered;
