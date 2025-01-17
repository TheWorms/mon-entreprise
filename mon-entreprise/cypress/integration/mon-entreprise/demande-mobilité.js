const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const DEMANDE_MOBILITE_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/demande-mobilité`

const writeFixtures = Cypress.env('record_http') !== undefined

describe(`Formulaire demande mobilité (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	if (!fr) {
		return
	}
	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = ['geo.api.gouv.fr']

	beforeEach(() => {
		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
		cy.visit(encodeURI('/gérer/demande-mobilité'))
	})
	afterEach(() => {
		cy.writeInterceptResponses(
			pendingRequests,
			responses,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
	})

	it('should not crash', () => {
		cy.contains('Demande de mobilité internationale')
	})
	it('should allow to complete and download', () => {
		// "coordonnées" section
		cy.contains('SIRET').click()
		cy.focused()
			.type('684 064 0011')
			.tab()
			.type('Deaux')
			.tab()
			.type('Jean')
			.tab()
			.type('Française')
		cy.contains('sécurité sociale').click()
		cy.focused().type('1 91 07 468 054 75').tab().type('1991-07-25')

		cy.get(
			"input[name='coordonnées assuré . commune de naissance . étranger'][value='non']"
		)
			.next()
			.click()
			.wait(500)

		cy.focused().tab().type('Pouts').wait(1500).type('{enter}')

		cy.get(
			"input[name='coordonnées assuré . domicile personnel . commune . étranger'][value='non']"
		)
			.next()
			.click()

		cy.focused()
			.tab()
			.type('3 rue de la Rhumerie')
			.tab()
			.type('Brest')
			.wait(1500)
			.type('{enter}')
			.tab()
			.type('jean.deaux@gmail.com')
			.tab()
			.type('06 85 69 78 54')
			.tab()

		// "activité en France" section
		cy.focused()
			.type('Deaux & Fils')
			.tab()
			.type('14 chemin des Docks')
			.tab()
			.type('Bre')
			.wait(1500)
		cy.contains('29240').click()
		cy.contains('Organisme Urssaf').click()
		cy.focused().type('Bretagne').tab().tab().type('Boulangerie')

		// "votre demande" section
		cy.get("input[name='demande . pays unique'][value='oui']").next().click()
		cy.get("input[name='demande . infrastructure sauvegardée'][value='oui']")
			.next()
			.click()
		cy.get("input[name='demande . activité semblable'][value='oui']")
			.next()
			.click()
		cy.get("input[name='demande . date de fin connue'][value='oui']")
			.next()
			.click()
		cy.get('label[for="détachement . pays"]').wait(1500).click()
		cy.focused()
			.select('Irlande')
			.tab()
			.type('2020-11-06')
			.tab()
			.type('2021-04-09')
			.tab()
			.tab()
			.type('Fabrications de gateaux bretons')
		cy.get("input[name='détachement . base fixe'][value='non']").next().click()
		cy.get(
			"input[name='commentaires additionnels . commentaires'][value='non']"
		)
			.next()
			.click()

		// download PDF
		cy.contains(
			'Je certifie l’exactitude des informations communiquées ci-dessus'
		).click()
		cy.contains('Fait à').click()
		cy.focused().type('Plougastel')
		cy.contains('Générer la demande').click()
		cy.contains('Télécharger le fichier').click()
	})
})
