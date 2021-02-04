/// <reference types="cypress" />
import {
    acceptCookieConsent,
    validateCookieConsentClosed
} from "../../page-objects/cookie-consent"
import {
    navigateToHomePage,
    enterSearchTerm,
    selectSearchResult,
    mockSuggestedDestinationSearchResults
} from "../../page-objects/homepage"

describe('Homepage Tests', () => {
    beforeEach(() => {
        navigateToHomePage()
    })

    it('should not display cookie banner after clicking accept', () => {
        acceptCookieConsent()
        validateCookieConsentClosed()
    })

    it('should go to correct url after selecting suggested destination', () => {
        mockSuggestedDestinationSearchResults('mayo_suggested_destinations_post_response.json')
        enterSearchTerm('Mayo')
        selectSearchResult()
        cy.url().should('eq', 'https://www.discoverireland.ie/great-western-greenway')
    })
})