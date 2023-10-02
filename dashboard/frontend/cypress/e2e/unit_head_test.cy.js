/* eslint-disable cypress/no-unnecessary-waiting */


function performLoginMaster() {
    const mailfield = "#loginID";
    const passw = "#password";
    cy.visit('localhost:3000');
    cy.get(mailfield).type("bertil.nedregard@trondheim.kommune.no");
    cy.get(passw).type("defaultpassword");
    cy.get('button').click();
}

describe('Test frigjør lisens - Bertil', () => {
    beforeEach(() => {
        // run these tests as if in a desktop
        // browser with a 720p monitor
        cy.viewport(1280, 1100);
        performLoginMaster();
    });
    let app_navn;
    let rad_2;


    it('tester om en master user kan godkjenne frigjøring av en lisens', () => {
        cy.wait(1000);
        // går til min side
        cy.get('[data-testid="menuIcon"]').click();
        cy.get('a[href="/minside"]').click();

        // lagrer navnet på første lisens, brukes nedenfor for å sjekke at den ikke lenger finnes
        cy.get('table')
            .first()
            .find('tbody tr:first-child')
            .invoke('html')
            .then(innerHtml => {
                app_navn = innerHtml;
                Cypress.env('app_navn', innerHtml);
            });

        // finner første godkjenn-knapp av forespørsler. failer hvis ingen forespørsler finnes
        cy.get('[data-testid="approve-button"]')
            .first()
            .click()

        cy.get('table')
            .first()
            .find('tbody tr:first-child')
            .invoke('html')
            .then(innerHtml => {
                rad_2 = innerHtml;
                Cypress.env('rad_2', innerHtml)

            })
            .then(() => {
                    expect(app_navn).to.not.eq(rad_2);
                }
            )
        ;
    });
});

