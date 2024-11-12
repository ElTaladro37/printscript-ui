import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
     cy.loginToAuth0(
         AUTH0_USERNAME,
         AUTH0_PASSWORD
     )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/snippet/text", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("fileUrl", "snippetId", "languageId", "versionId")
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('[data-testid="menu-option-printScript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`println("Hola");`);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/");

    // Intercept the POST request and validate the response
    cy.intercept('POST', BACKEND_URL + "/snippet/text", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("fileUrl", "snippetId", "languageId", "versionId");
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    // Open the menu to select "Load snippet from file"
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="-1"]').should('be.visible').click();

    // Upload the file directly to the input element
    cy.get('[data-testid="upload-file-input"]').should('exist').selectFile('cypress/fixtures/example.prs', { force: true });

    // Click the Save button to submit
    cy.get('[data-testid="SaveIcon"]').should('be.visible').click();

    // Wait for the POST request to complete and validate the status code
    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  });


})
