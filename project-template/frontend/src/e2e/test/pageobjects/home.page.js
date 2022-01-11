const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {

  get btnSubmit() {
    // console.log($('button[type="button"]').getHTML())
    return $('.submit');
  }

  get usernameInput() {
    return $('#username');
  }

  get passwordInput(){
    return $('#password');
  }

  get confirmationText() {
    return $("#confirmation");
  }

  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.btnSubmit.click();
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open('');
  }
}

module.exports = new HomePage();
