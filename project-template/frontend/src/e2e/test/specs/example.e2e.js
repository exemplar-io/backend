const HomePage = require('../pageobjects/home.page');

describe('Home Page', () => {
  it('Should display login button', async () => {
    await HomePage.open();
    await HomePage.login("admin", "password");
    await expect(HomePage.confirmationText).toHaveTextContaining("Logged in!")
  });
});
