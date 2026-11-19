// Custom commands for characterisation tests
Cypress.Commands.add('setJwt', (token) => {
  // The legacy app reads the token from the key defined in AppConstants.jwtKey ("jwtToken").
  // To be defensive across possible variants, set both 'jwtToken' and 'jwt'.
  cy.window().then((win) => {
    try {
      win.localStorage.setItem('jwtToken', token);
      win.localStorage.setItem('jwt', token);
    } catch (e) {
      // In some runtimes window.localStorage may be restricted; swallow errors here.
      // Tests will surface failures when requests are asserted.
    }
  });
});

Cypress.Commands.add('clearJwt', () => {
  cy.window().then((win) => {
    try {
      win.localStorage.removeItem('jwtToken');
      win.localStorage.removeItem('jwt');
    } catch (e) {}
  });
});
