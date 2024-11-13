import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {

    // login
     cy.loginToAuth0(
        AUTH0_USERNAME,
         AUTH0_PASSWORD
     )

    // get all snippets
    cy.intercept('GET', BACKEND_URL+"/snippets/all", {
      statusCode: 200,
      body: [snippet]
    }).as("getSnippets")

    cy.intercept('GET', BACKEND_URL+"/snippet/1", {
        statusCode: 200,
        body: snippet
    }).as("getSnippet")

    cy.visit("/")

    // cy.wait("@getSnippets")
    cy.wait(5000) // TODO comment this line and uncomment 19 to wait for the real data
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
    cy.wait(5000)
  })

  it('Can share a snippet', () => {
    // Wait for the UI elements to be ready
    cy.wait(2000);

    // Share the snippet
    cy.get('[aria-label="Share"]').click();
    cy.get('button[aria-label="Open"]').click();
    cy.get('[role="listbox"] li:nth-child(1)').click();

    // Wait for the share action to complete and assert visibility
    cy.wait(1000);
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').should('be.visible').click();

    // Wait for the final result of sharing
    cy.wait(2000);
  });


/*  it('Can run snippets', function() {
    cy.get('[data-testid="PlayArrowIcon"]').click();
    cy.get('.css-1hpabnv > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').should("have.length.greaterThan",0);
  });*/

  it('Can format snippets', function() {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})

const snippet = {
  "content": 'let a:number = 1;',
  "fileUrl": 'www.hola.com',
  "snippetId": '1',
  "languageId": '1',
  "versionId": '1',
  "name": 'Test Snippet',
  "description": 'Test Description'
}