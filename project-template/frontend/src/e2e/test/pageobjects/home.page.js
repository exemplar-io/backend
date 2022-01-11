const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
  /**
   * define selectors using getter methods
   */

  get btnSubmit() {
    // console.log($('button[type="button"]').getHTML())
    return $('.submit');
  }

  async authorize(username, password) {
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
