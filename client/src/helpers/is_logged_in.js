import store from 'store';
const storage = require('../helpers/storage.js');

export default () => !!store.get('loggedIn');