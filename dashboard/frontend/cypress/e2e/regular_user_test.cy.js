/* eslint-disable cypress/no-unnecessary-waiting */

// Function to perform login
function performLogin() {
    const mailfield = "#loginID";
    const passw = "#password";

    cy.visit('localhost:3000');
    cy.get(mailfield).type("leendert.wienhofen@trondheim.kommune.no");
    cy.get(passw).type("defaultpassword");
    cy.get('button').click();
}

describe('Test kjøp fra Pool - Leendert', () => {
    beforeEach(() => {
        // run these tests as if in a desktop
        // browser with a 720p monitor
        cy.viewport(1280, 1100);
        performLogin();
    });
    let app_name;
    it('tester om en lisens kan kjøpes fra pool', () => {
        // sjekker om lenken i navbar fungerer, og om man kommer seg tilbake til dashbord
        cy.wait(2000)
        cy.get('[data-testid="menuIcon"]').click();
        cy.get('a[href="/lisensportal"]:first').click();
        cy.url().should('eq', 'http://localhost:3000/lisensportal');
        cy.get('[data-testid="menuIcon"]').click();
        cy.get('a[href="/"]').eq(1)
            .should("contain", "Mitt dashboard")
            .click();
        cy.url().should('eq', 'http://localhost:3000/');

        // sjekker om direktelenken til license-pool fungerer
        cy.get('#portal-link').click();
        cy.url().should('eq', 'http://localhost:3000/lisensportal');

        // sjekker om breadcrumbs er riktig
        cy.get('#breadcrumbs')
            .should("exist")
            .should("contain", "Lisensportalen");

        // navigerer licensepool-tabell og utvider første lisens
        cy.get('table')
            .find('tr:first-child')
            .find('td:first-child')
            .find('button:first-child').click()
        // sjekker om man kan kjøpe lisensen
        cy.get('[data-testid="AddShoppingCartIcon"]').click();

        // lukker vinduet hvis lisensen allerede er kjøpt
        cy.get('[data-testid="CloseIcon"]').click();

        // denne fungerer kun hvis lisensen ikke er forespurt kjøpt, som mest sannsynlig ikke er tilfelle i databasen
        // cy.get('[data-testid="kjop-lisens-id"]').click();

    });
});

describe('Test dashboard', () => {
    beforeEach(() => {
        // run these tests as if in a desktop
        // browser with a 720p monitor
        cy.viewport(1280, 1100);
        performLogin();
    });


    it('asserts buttons on dashboard works, and breadcrumbs read correct', () => {
        // klikker de tre øverste knappene på dashbord, sjekker om de går til riktig url og breadcrumb
        // first button
        cy.get('[data-testid="infoBox-test"]:first')
            .should("exist")
            .click();
        cy.wait(1000);

        cy.url().should('eq', 'http://localhost:3000/Totale%20Lisenser');
        cy.get('#breadcrumbs')
            .should("exist")
            .should("contain", "Totale Lisenser");

        // second button
        cy.visit('http://localhost:3000/');
        cy.wait(1000);

        cy.get('[data-testid="infoBox-test"]').eq(1)
            .should("exist")
            .click();
        cy.wait(1000);

        cy.url().should('eq', 'http://localhost:3000/Ubrukte%20Lisenser');
        cy.get('#breadcrumbs')
            .should("exist")
            .should("contain", "Ubrukte Lisenser");

        // third button
        cy.visit('http://localhost:3000/');
        cy.wait(1000);

        cy.get('[data-testid="infoBox-test"]').eq(2)
            .should("exist")
            .click();
        cy.wait(1000);

        cy.url().should('eq', 'http://localhost:3000/Ledige%20Lisenser');
        cy.get('#breadcrumbs')
            .should("exist")
            .should("contain", "Ledige Lisenser");

    });
});

describe('Test frigjør lisens - Leendert', () => {
    beforeEach(() => {
        // run these tests as if in a desktop
        // browser with a 720p monitor
        cy.viewport(1280, 1100);
        performLogin();
    });
    let app_name;
    it('tester om en lisens kan forespørres frigjort', () => {
        cy.get('[data-testid="infoBox-test"]:first')
            .should("exist")
            .click();
        cy.wait(1000);
        cy.url().should('eq', 'http://localhost:3000/Totale%20Lisenser');

        // klikker "vis mine lisenser"
        cy.get('.PrivateSwitchBase-input').click()
        cy.wait(1000)

        // lagrer første rad som en variabel, så det kan sjekkes at forespørringen ligger inne i "min sider"
        cy.get('table')
            .find('tbody tr:first-child')
            //.find('td:nth-child(2)')
            .find('th')
            .invoke('html')
            .then(innerHtml => {
                app_name = innerHtml;
                Cypress.env('app_name', innerHtml);
            });

        // utvider første lisens i tabellen
        cy.get('table')
            .find('tr:first-child')
            .find('td:first-child')
            .find('button:first-child').click()

        // klikker på "send forespørsel"
        cy.get('[data-testid="foresporsel-release-id"]').click()

    });
});

describe('Test min side - Leendert', () => {
    beforeEach(() => {
        // run these tests as if in a desktop
        // browser with a 720p monitor
        cy.viewport(1280, 1100);
        performLogin();
    });
    it('tester om lisensen som ble forespurt på er i listen over forespurte på min side', () => {
        // går til min side
        cy.get('[data-testid="menuIcon"]').click();
        cy.get('a[href="/minside"]').click();

        // sjekker om forespørselen fra istad ligger inne
        cy.get('table')
            .first()
            .contains(Cypress.env('app_name'))
            .should('exist');
    });

    it('sjekker om epost er riktig, vis historikk og breadcrumbs fungerer', () => {

        // går til min side
        cy.get('[data-testid="menuIcon"]').click();
        cy.get('a[href="/minside"]').click();

        // sjekker at breadcrumbs fungerer
        cy.get('#breadcrumbs')
            .should("exist")
            .should("contain", "Min side");

        // sjekker at epost er riktig
        cy.get('[data-testid="email-id"]').should("have.text", "Epost: leendert.wienhofen@trondheim.kommune.no");

        // klikker på "vis historikk"
        cy.get('input[type="checkbox"]')
            .first()
            .click();

        cy.wait(1000);

        // sjekker at historikk-tabellen dukker opp når man har bedt om at den vises
        //cy.get('[data-testid="request-history"]').should("exist")
        cy.get('table').last().should('exist');
    });
});


