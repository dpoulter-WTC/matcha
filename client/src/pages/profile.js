import React, { Component } from 'react';
import styles from "../styles/profile.module.css";
import ImageGallery from 'react-image-gallery';
import style from "react-image-gallery/styles/css/image-gallery.css";
import isLoggedIn from '../helpers/is_logged_in';
import store from 'store';
const storage = require('../helpers/storage.js');

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
    description: "Hello",
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
    description: "This",
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
    description: "Test",
  },
];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      liked: 0,
      viewsJSON: [],
      likesJSON: [],
    };
    this.likeButton = this.likeButton.bind(this);
  }

  async UNSAFE_componentWillMount() {
    if (!isLoggedIn()) {
      window.location.href = "/login"
    }
    console.log(JSON.stringify({ username: this.props.match.params.username }))
    if (this.props.match.params.username) {
      const response = await fetch('http://' + window.location.hostname + ':9000/profile/profileinfo', {
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username: this.props.match.params.username })
      })
      const data = await response.json();
      const data2 = await response;
      console.log(data2)
      this.setState({
        username: data.username
      })

    }

    const response = await fetch('http://' + window.location.hostname + ':9000/profile/checklike', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: this.state.username, username: storage.unhash(store.get('username')) })
    })
    const data = await response.json();
    console.log(data)
    this.setState({
      liked: data.ID ? data.ID : 0
    })

    await fetch('http://' + window.location.hostname + ':9000/profile/viewed', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: this.state.username, username: storage.unhash(store.get('username')) })
    })

    const res = await fetch('http://' + window.location.hostname + ':9000/profile/grabviewed', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: this.state.username })
    })
    const views = await res.json();
    this.setState({
      viewsJSON: views
    })

    const res1 = await fetch('http://' + window.location.hostname + ':9000/profile/grabliked', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: this.state.username })
    })
    const likes = await res1.json();
    this.setState({
      likesJSON: likes
    })
  }

  async unLikeUsername(username) {
    await fetch('http://' + window.location.hostname + ':9000/profile/unlike', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: username, username: storage.unhash(store.get('username')) })
    })
  }

  async likeUsername(username) {
    await fetch('http://' + window.location.hostname + ':9000/profile/like', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: username, username: storage.unhash(store.get('username')) })
    })
  }



  likeButton() {
    if (storage.unhash(store.get('username')) === this.state.username) {
      return (
        <button>Edit Profile</button>
      )
    }
    if (this.state.liked) {
      return (
        <button onClick={() => this.unLikeUsername(this.state.username)}>Unlike</button>
      )
    }
    return (
      <button onClick={() => this.likeUsername(this.state.username)}>Like</button>
    )
  }

  render() {
    let viewsArr = [];
    if (this.state.viewsJSON.length > 0) {
      viewsArr = this.state.viewsJSON.map(function (view) {
        const url = "/profile/" + view.username;
        return (
          <a href={url}>
            <div className={styles.view}>
              {view.username}
            </div>
          </a>
        );
      });
    }
    let likesArr = [];
    if (this.state.likesJSON.length > 0) {
      likesArr = this.state.likesJSON.map(function (like) {
        const url = "/profile/" + like.username;
        return (
          <a href={url}>
            <div className={styles.like}>
              {like.username}
            </div>
          </a>
        );
      });
    }
    return (
      <div className={styles.background}>
        <div className={styles.content}>

          <div className={styles.header}>
            <div className={styles.headercontent}>
              <div className={styles.left}>
                <img src="https://placebear.com/200/200" style={{ paddingRight: "25px" }} />
                <span className={styles.name}>{this.state.username}</span>
              </div>
              <div className={styles.right}>
                <div className={styles.rightButton}>
                {this.likeButton()}
                </div>
                <h2>Fame:</h2>
              </div>
            </div>
          </div>

          <div className={styles.mainBody}>
            <div className={styles.images}>
              <ImageGallery className={style} items={images} showPlayButton={false} />
            </div>
            <div className={styles.sideBar}>
              <h1>Views</h1>
              {viewsArr}
              <h1>Likes</h1>
              {likesArr}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;