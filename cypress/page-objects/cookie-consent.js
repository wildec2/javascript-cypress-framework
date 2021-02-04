/// <reference types="cypress" />
export function acceptCookieConsent() {
    cy.get('#CybotCookiebotDialogBodyButtonAccept', { timeout: 10000 }).click()
}

export function validateCookieConsentClosed() {
    cy.get('#CybotCookiebotDialogBodyButtonAccept').should('not.be.visible')
}