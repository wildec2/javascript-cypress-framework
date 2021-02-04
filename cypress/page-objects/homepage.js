/// <reference types="cypress" />

export function navigateToHomePage() {
    cy.visit('/')
}

export function enterSearchTerm(searchTerm) {
    cy.get('#Hero__Search').type(searchTerm)
}

export function mockSuggestedDestinationSearchResults(mockedSuggestedDestinationResults) {
    cy.intercept('POST', '/indexes/destinations', { fixture: mockedSuggestedDestinationResults })
}

export function selectSearchResult() {
    cy.get('.gtm-searchDestination').first().click()
}