import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";

describe('Home', () => {
  beforeEach(() => {
     cy.loginToAuth0(
      AUTH0_USERNAME,
         AUTH0_PASSWORD
     )
  })
  before(() => {
    process.env.FRONTEND_URL = FRONTEND_URL
    process.env.BACKEND_URL = BACKEND_URL
  })
  it('Renders home', () => {
    cy.visit(FRONTEND_URL)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(FRONTEND_URL)
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lessThan', 11)
  })

  it('Can create snippet find snippets by name', () => {
    cy.visit(FRONTEND_URL)
    const snippetData = {
      name: "name",
      description: "hola",
      language: "printScript",
      version: "1.1",
      snippetFile: "println(\"hola\");"
    }

    const authToken = localStorage.getItem('authAccessToken');

    cy.intercept('GET', BACKEND_URL+"/snippets/all?page=0&size=10&owner=true&share=true&name=name", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');

    cy.request({
      method: 'POST',
      url: BACKEND_URL + '/snippet/text',
      headers: {Authorization: `Bearer ${authToken}`},
      body: snippetData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name);

      cy.wait("@getSnippets")
      cy.contains(snippetData.name).should('exist');
    })
  })
})
