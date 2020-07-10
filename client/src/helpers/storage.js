module.exports = {
    /**
   *
   *
   * @param { string } rawPass - the password to be hashed
   * @returns {string} 
   */
  hash(rawPassword) {
    var encodedString = btoa(rawPassword);
    return encodedString;
  },

  /**
   *
   *
   * @param { string } encryptedPass - the password to be hashed
   * @returns {string} 
   */
  unhash(encryptedPass) {
    var rawPassword = atob(encryptedPass);
    return rawPassword;
  },

}