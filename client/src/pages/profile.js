import React, { Component } from 'react';
import styles from "../styles/profile.module.css";
import ImageGallery from 'react-image-gallery';
import style from "react-image-gallery/styles/css/image-gallery.css";
import isLoggedIn from '../helpers/is_logged_in';
import store from 'store';
import nextPath from '../helpers/nextPath';
const storage = require('../helpers/storage.js');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      liked: 0,
      viewsJSON: [],
      likesJSON: [],
      pp: '',
      images: [],
      fame: 0,
      bio: ''
    };
    this.likeButton = this.likeButton.bind(this);
  }

  async UNSAFE_componentWillMount() {
    if (!isLoggedIn()) {
      nextPath('/login')
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
        username: data.username,
        bio: data.bio
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

    const fameres = await fetch('http://' + window.location.hostname + ':9000/profile/grabfame', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: this.state.username })
    })
    const fame = await fameres.json();
    this.setState({
      fame: fame.length > 0 ? fame.length : 0
    })


    const profilePictures = await fetch('http://' + window.location.hostname + ':9000/profile/getpp', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ username: this.state.username, img_pos: 5 })
    })
    const getpp = await profilePictures.json();
    var links = "";
    if (getpp.link) {
      links = 'http://' + window.location.hostname + ':9000/images/' + getpp.link
    }
    else {
      links = "https://picsum.photos/id/1018/1000/600/"
    }
    this.setState({
      pp: links
    })

    const pictures = await fetch('http://' + window.location.hostname + ':9000/profile/getpictures', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ username: this.state.username })
    })
    const picture = await pictures.json();
    let picarr = []
    if (picture.length > 0) {
      picarr = picture.map(function (val) {
        return ({ original: 'http://' + window.location.hostname + ':9000/images/' + val.link })
      })
    } else {
      picarr = [{ original: "https://picsum.photos/id/1018/1000/600/" }]
    }
    this.setState({

      images: picarr
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
    nextPath('/profile/' + username)
  }

  async report(username) {
    await fetch('http://' + window.location.hostname + ':9000/profile/report', {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ profile: username, username: storage.unhash(store.get('username')) })
    })
    nextPath('/')
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
    nextPath('/profile/' + username)
  }



  likeButton() {
    if (storage.unhash(store.get('username')) === this.state.username) {
      return (
        <button onClick={() => nextPath('/setting')}>Edit Profile</button>
      )
    }
    if (this.state.liked) {
      return (
        <div>
          <button onClick={() => this.unLikeUsername(this.state.username)}>Unlike</button>
          <button onClick={() => nextPath('/chat/' + this.props.match.params.username)}>Chat</button>
        </div>
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
                <img src={this.state.pp} style={{ paddingRight: "25px", maxHeight: "200px", maxWidth: "200px" }} />
                <div>
                <span className={styles.name}>{this.state.username}</span>
                <br />
                <span>{this.state.bio}</span>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.rightButton}>
                  {this.likeButton()}
                </div>
                <div>
                <button onClick={() => this.report(this.state.username)}>Report Profile</button>
                </div>
                <h2>Fame: {this.state.fame}</h2>
              </div>
            </div>
          </div>

          <div className={styles.mainBody}>
            <div className={styles.images}>
              <ImageGallery className={style} items={this.state.images} showPlayButton={false} />
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