describe('test exo 50', () => {
    it('Connection', () => {
        cy.visit('http://localhost:3000/Exercice-50.html')
    })
    it('Vous cliquez sur un tag et modifier le premier tag en "JAVASCRIPT!!!"', () => {
        cy.visit('http://localhost:3000/Exercice-50.html')

        cy.get('#items').children().first().click()
        cy.get('#line').type("JAVASCRIPT!!!!!!!!!!!")
        cy.get("#modification").click()
        cy.get('#items').contains("JAVASCRIPT!!!!!!!!!!!")
        
    })
})