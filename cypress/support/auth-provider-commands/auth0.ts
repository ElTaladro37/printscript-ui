import {VITE_AUTH0_DOMAIN} from "../../../src/utils/constants";

export function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit('/')

    cy.intercept("POST", "https://" + VITE_AUTH0_DOMAIN + "/oauth/token").as("login")

    // Login on Auth0.
  cy.origin(
      "https://dev-yjbbmbvlnk6d2bqm.us.auth0.com",
      { args: { username, password } },
      ({ username, password }) => {
          console.log(username + password)
        cy.get('input#username').type(username)
        cy.get('input#password').type(password, { log: false })
        cy.contains('button[value=default]', 'Continue').click()
      }
  )

    cy.wait('@login').then(({ response }) => {
        const { access_token } = response.body
        cy.window().then((win) => {
            win.localStorage.setItem('authAccessToken', access_token)
        });
    });

    // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should('equal', "http://localhost:5173/")
}




