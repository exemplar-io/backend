const HomePage = require('../pageobjects/home.page');

describe('Home Page', () => {
  it('Should display login button', async () => {
    await HomePage.open();
    await expect(HomePage.btnSubmit).toHaveTextContaining('Login');
  });
});
