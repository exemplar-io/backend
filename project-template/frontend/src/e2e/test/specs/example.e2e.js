const HomePage = require('../pageobjects/home.page');

describe('Home Page', () => {
  it('Should display login success text', async () => {
    await HomePage.open();
    await HomePage.$('#username').setValue(username);
    await HomePage.$('#password').setValue(password);
    await HomePage.$('.submit').click();
    await expect(HomePage.confirmationText).toHaveTextContaining("Logged in!")
  });
});
