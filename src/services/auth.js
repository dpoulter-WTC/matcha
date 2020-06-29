import firebase from "gatsby-plugin-firebase"

export const isBrowser = () => typeof window !== "undefined"
export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}
const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))
export const handleLogin = ({ username, password }) => {
  firebase.database().ref('/Users/' + username).once('value').then(function(snapshot) {
    var test = snapshot.val();
    var test1 = snapshot.val().username;
    console.log(test + " Blank " + test1);
  });
  if (username === `john` && password === `pass`) {
    return setUser({
      username: `john`,
      name: `Johnny`,
      email: `johnny@example.org`,
    })
  }
  return false
}
export const isLoggedIn = () => {
  const user = getUser()
  return !!user.username
}
export const logout = callback => {
  setUser({})
  callback()
}
