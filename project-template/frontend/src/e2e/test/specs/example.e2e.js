const HomePage = require('../pageobjects/home.page');

describe('Home Page', () => {
  it('Should display Authorize Github button', async () => {
    await HomePage.open();
    await expect(HomePage.btnSubmit).toHaveTextContaining('Authorize Github');
  });
});
