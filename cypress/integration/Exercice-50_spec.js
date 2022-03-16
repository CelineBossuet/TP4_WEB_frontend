describe('test exo 50', () => {
    it('Connection', () => {
        cy.visit('http://localhost:3000/Exercice-50.html')
    })
    it(' cliquer sur un tag et modifier le premier tag en "JAVASCRIPT!!!"', () => {
        cy.visit('http://localhost:3000/Exercice-50.html')

        // on click sur le premier enfant de items qui correspond donc au 1er tag
        cy.get('#items').children().first().click()
        //on supprime l'ancien nom du tag
        cy.get('#line').clear()
        //on renomme le tag
        cy.get('#line').type("JAVASCRIPT!!!!!!!!!!!")
        //on actualise le tag avec le nouveau nom
        cy.get("#modification").click()
        //on vérifie que le tag a bien été modifé
        cy.get('#items').contains("JAVASCRIPT!!!!!!!!!!!")
        
    })
})