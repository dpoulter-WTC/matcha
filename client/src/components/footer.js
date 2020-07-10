import React, { Component } from 'react';

import styles from "./footer.module.css"

class Footer extends Component {
    render() {
        return (
            <div>
                <footer className={styles.footer}>
                    Copywrite © Meghan and Daniel 2020
                </footer>
            </div>
        )
    }
}

export default Footer;