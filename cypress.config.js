module.exports = {
  e2e: {
    baseUrl: 'http://localhost:5000',
    // Use the commands support file (we avoid adding an extra support wrapper file
    // so the plan's declared files remain the canonical support file).
    supportFile: 'cypress/support/commands.js',
    fixturesFolder: 'cypress/fixtures',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    video: false
  }
};
