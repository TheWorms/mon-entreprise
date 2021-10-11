import { Explicable } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import { Condition } from 'Components/EngineValue'
import PageHeader from 'Components/PageHeader'
import { FromTop } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { EngineContext, EngineProvider } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { usePersistingState } from 'Components/utils/persistState'
import { DottedName } from 'modele-social'
import Engine, { UNSAFE_isNotApplicable } from 'publicodes'
import { equals, isEmpty, omit } from 'ramda'
import {
	createElement,
	lazy,
	Suspense,
	useCallback,
	useContext,
	useState,
} from 'react'
import { TrackPage } from '../../../ATInternetTracking'
import { hash } from '../../../utils'
import formulaire from './demande-mobilité.yaml'
import picture from './undraw_Traveling_re_weve.svg'

const LazyEndBlock = lazy(() => import('./EndBlock'))

export default function PageMobilité() {
	const engine = new Engine(formulaire)

	return (
		<>
			<PageHeader
				titre={'Demande de mobilité internationale'}
				picture={picture}
			>
				<p className="ui__ lead">
					Vous êtes travailleur indépendant ou auto-entrepreneur et souhaitez
					travailler à l'étranger ? Vous trouverez ici toutes les informations
					pour remplir une demande de certificat A1 afin d'être couverts pendant
					votre déplacement.
				</p>
			</PageHeader>
			<EngineProvider value={engine}>
				<FormulairePublicodes />
			</EngineProvider>
		</>
	)
}

const useFields = (
	engine: Engine<string>
): Array<ReturnType<Engine['getRule']>> => {
	return Object.keys(engine.getParsedRules())
		.filter((dottedName) => {
			const evaluation = engine.evaluate(dottedName)
			const rule = engine.getRule(dottedName)
			const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
			const displayRule =
				(isNotApplicable === false &&
					(equals(evaluation.missingVariables, { [dottedName]: 1 }) ||
						isEmpty(evaluation.missingVariables)) &&
					(rule.rawNode.question || rule.rawNode.API || rule.rawNode.type)) ||
				(isNotApplicable === false &&
					rule.rawNode.type === 'groupe' &&
					Object.keys(evaluation.missingVariables).every((childDottedName) =>
						childDottedName.startsWith(dottedName)
					))
			return displayRule
		})
		.map((dottedName) => engine.getRule(dottedName))
}

const VERSION = hash(JSON.stringify(formulaire))
function FormulairePublicodes() {
	const engine = useContext(EngineContext)
	const [situation, setSituation] = usePersistingState<Record<string, string>>(
		`formulaire-détachement:${VERSION}`,
		{}
	)
	console.log(situation)
	const onChange = useCallback(
		(dottedName, value) => {
			if (value === undefined) {
				setSituation((situation) => omit([dottedName], situation))
			} else {
				setSituation((situation) => ({
					...situation,
					[dottedName]: value,
				}))
			}
		},
		[setSituation]
	)

	// This is a hack to reset value inside all uncontrolled fields input on clear
	const [clearFieldsKey, setKey] = useState(0)
	const handleClear = useCallback(() => {
		setSituation({})
		setKey(clearFieldsKey + 1)
	}, [clearFieldsKey, setSituation])

	engine.setSituation(situation)
	const fields = useFields(engine)

	const isMissingValues = fields.some(
		({ dottedName }) => !isEmpty(engine.evaluate(dottedName).missingVariables)
	)

	return (
		<FromTop key={clearFieldsKey}>
			{fields.map(
				({ rawNode: { description, type, question }, title, dottedName }) => (
					<FromTop key={dottedName}>
						{type === 'groupe' ? (
							<>
								{createElement(
									`h${Math.min(dottedName.split(' . ').length + 1, 6)}`,
									{},
									title
								)}
								{description && <Markdown source={description} />}
							</>
						) : type === 'notification' ? (
							<Condition expression={dottedName}>
								<small
									css={`
										color: #ff2d96;
									`}
								>
									{description}
								</small>
							</Condition>
						) : (
							<>
								<label htmlFor={dottedName}>
									{question ? (
										<span
											css={`
												margin-top: 0.6rem;
											`}
										>
											<Markdown source={question} />
										</span>
									) : (
										<small>{title}</small>
									)}{' '}
								</label>
								{description && (
									<Explicable>
										<h3>{title}</h3>
										<Markdown source={description} />
									</Explicable>
								)}
								<RuleInput
									id={dottedName}
									dottedName={dottedName as DottedName}
									onChange={(value) => onChange(dottedName, value)}
								/>
							</>
						)}
					</FromTop>
				)
			)}
			<Condition expression="DLA">
				<Suspense fallback={null}>
					<LazyEndBlock fields={fields} isMissingValues={isMissingValues} />
				</Suspense>
			</Condition>

			{!!Object.keys(situation).length && (
				<div
					css={`
						text-align: right;
					`}
				>
					<button className="ui__  small button" onClick={handleClear}>
						<Emoji emoji={'🗑️'} /> Effacer mes réponses
					</button>
				</div>
			)}
			{!Object.keys(situation).length ? (
				<TrackPage name="accueil" />
			) : isMissingValues ? (
				<TrackPage name="commence" />
			) : null}
		</FromTop>
	)
}
