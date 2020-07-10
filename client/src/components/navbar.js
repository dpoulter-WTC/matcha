import React, { Component } from 'react';
import isLoggedIn from '../helpers/is_logged_in';
import nextPath from '../helpers/nextPath';

import styles from "./navbar.module.css"

function loggedIN() {
    return (
        <header className={styles.navbar}>
            <div className={styles.navbarTitle} onClick={event => nextPath('/')}>ProdHub</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/browse')}>Browse</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/profile')}>Profile</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/setting')}>Settings</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/logout')}>Logout</div>

            {/* <div className={styles.navbarItem}>Help</div> */}
        </header>
    )
}

function loggedOUT() {
    return (
        <header className={styles.navbar}>
            <div className={styles.navbarTitle} onClick={event => nextPath('/')}>ProdHub</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/register')}>Register</div>
            <div className={styles.navbarItem} onClick={event => nextPath('/login')}>Login</div>

            {/* <div className={styles.navbarItem}>Help</div> */}
        </header>
    )
}

class Header extends Component {
    render() {
        return (
            <div>
                {isLoggedIn() ? loggedIN() : loggedOUT()}
            </div>
        )
    }
}

export default Header;