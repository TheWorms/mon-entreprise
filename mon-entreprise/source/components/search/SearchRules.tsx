import '../ui/Card.css'
import './SearchRulesAndSimulators.css'
import 'instantsearch.css/themes/satellite.css'

import algoliasearch from 'algoliasearch/lite'
import { Trans, useTranslation } from 'react-i18next'
import { InstantSearch, SearchBox } from 'react-instantsearch-dom'
import { RulesInfiniteHits } from './RulesInfiniteHits'

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || ''
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY || ''
const ALGOLIA_INDEX_PREFIX = process.env.ALGOLIA_INDEX_PREFIX || ''

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY)

export default function SearchRules() {
	const { t } = useTranslation()
	return (
		<InstantSearch
			indexName={`${ALGOLIA_INDEX_PREFIX}rules`}
			searchClient={searchClient}
		>
			<SearchBox
				translations={{
					submitTitle: t('Valider votre recherche'),
					resetTitle: t('Réinitialiser votre recherche'),
					placeholder: t('Cherchez par mot-clef ou acronyme...'),
				}}
			/>
			<h2>
				<Trans>Règles de calculs</Trans>
			</h2>
			<RulesInfiniteHits />
		</InstantSearch>
	)
}
