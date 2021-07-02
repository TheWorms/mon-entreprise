import Engine, {
	formatValue,
	isNotYetDefined,
	serializeUnit,
	simplifyNodeUnit,
	utils,
	EvaluatedNode,
} from 'publicodes'
import { isEmpty } from 'ramda'
import { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EngineContext } from '../contexts'
import Explanation from '../Explanation'
import { Markdown } from '../Markdown'
import { RuleLinkWithContext } from '../RuleLink'
import RuleHeader from './Header'
import References from './References'
import RuleSource from './RuleSource'

export default function Rule({ dottedName, language, situationName }) {
	const engine = useContext(EngineContext)
	const { pathname } = useLocation()

	if (!engine) {
		throw new Error('Engine expected')
	}
	if (!(dottedName in engine.getParsedRules())) {
		return <p>Cette règle est introuvable dans la base</p>
	}
	const rule = engine.evaluate(engine.getRule(dottedName)) as EvaluatedNode & {
		nodeKind: 'rule'
	}
	const { description, question } = rule.rawNode
	const { parent, valeur } = rule.explanation
	return (
		<div id="documentationRuleRoot">
			{situationName && (
				<div
					className="ui__ card notice light-bg"
					style={{
						display: 'flex',
						alignItems: 'baseline',
						flexWrap: 'wrap',
						margin: '1rem 0',
						paddingTop: '0.4rem',
						paddingBottom: '0.4rem',
					}}
				>
					<div>
						Vous explorez la documentation avec le contexte{' '}
						<strong className="ui__ label">{situationName}</strong>{' '}
					</div>
					<div style={{ flex: 1 }} />
					<div>
						<Link to={pathname}>Retourner à la version de base</Link>
					</div>
				</div>
			)}
			<RuleHeader dottedName={dottedName} />
			<section>
				<Markdown source={description || question} />
			</section>
			{
				<>
					<p
						className="ui__ lead card light-bg"
						style={{
							display: 'inline-block',
							padding: '1rem',
						}}
					>
						{formatValue(simplifyNodeUnit(rule), { language })}
						<br />
						{isNotYetDefined(rule.nodeValue) && rule.unit && (
							<small>Unité : {serializeUnit(rule.unit)}</small>
						)}
					</p>
				</>
			}
			{parent && 'nodeValue' in parent && parent.nodeValue === false && (
				<>
					<h3>Parent non applicable</h3>
					<p>
						Cette règle est non applicable car <Explanation node={parent} />
						est non applicable.
					</p>
				</>
			)}
			<h2>Comment cette donnée est-elle calculée ?</h2>
			<Explanation node={valeur} />
			<RuleSource key={dottedName} dottedName={dottedName} engine={engine} />

			{!isEmpty(rule.missingVariables) && (
				<>
					<h3>Données manquantes</h3>
					<p className="ui__ notice">
						Les règles suivantes sont nécessaires pour le calcul mais n'ont pas
						été saisies dans la situation. Leur valeur par défaut est utilisée.
					</p>
					{rule.missing && rule.missing.self && !isEmpty(rule.missing.self) && (
						<>
							<ul>
								{rule.missing.self.map((dottedName) => (
									<li key={dottedName}>
										<RuleLinkWithContext dottedName={dottedName} />
									</li>
								))}
							</ul>
						</>
					)}
					{rule.missing &&
						rule.missing.parent &&
						!isEmpty(rule.missing.parent) && (
							<>
								<h4>… dont celles provenant du parent</h4>
								<ul>
									{rule.missing.parent.map((dottedName) => (
										<li key={dottedName}>
											<RuleLinkWithContext dottedName={dottedName} />
										</li>
									))}
								</ul>
							</>
						)}
				</>
			)}

			<ReverseMissing dottedName={dottedName} engine={engine} />

			{!!rule.replacements.length && (
				<>
					<h3>Effets </h3>
					<ul>
						{rule.replacements.map((replacement) => (
							<li key={replacement.replacedReference.dottedName}>
								<Explanation node={replacement} />
							</li>
						))}
					</ul>
				</>
			)}

			<NamespaceChildrenRules dottedName={dottedName} engine={engine} />

			{rule.rawNode.note && (
				<>
					<h3>Note</h3>
					<div className="ui__ notice">
						<Markdown source={rule.rawNode.note} />
					</div>
				</>
			)}
			{rule.rawNode.références && (
				<>
					<h2>Références</h2>
					<References refs={rule.rawNode.références} />
				</>
			)}
		</div>
	)
}

function ReverseMissing({
	dottedName,
	engine,
}: {
	dottedName: string
	engine: Engine
}) {
	const [opened, setOpened] = useState(false)
	useEffect(() => {
		setOpened(false)
	}, [dottedName])

	const getRuleNamesWithMissing = () =>
		Object.keys(engine.getParsedRules()).filter((ruleName) => {
			const evaluation = engine.evaluate(engine.getRule(ruleName))
			return evaluation.missing?.self?.includes(dottedName)
		})

	return (
		<section>
			<span>
				<h3 style={{ display: 'inline-block', marginRight: '1rem' }}>
					Autres règles qui auraient besoin de cette valeur
				</h3>
				<a
					className="ui__ simple small button"
					onClick={() => {
						setOpened(!opened)
					}}
				>
					{opened ? 'cacher' : 'voir'}
				</a>
			</span>
			<p className="ui__ notice">
				Les règles suivantes ont besoin de la règle courante pour être
				calculées. Or, la règle courante n'étant pas encore définie, c'est sa
				valeur par défaut qui est utilisée pour déterminer la valeur de ces
				règles.
			</p>

			{opened && (
				<>
					<ul>
						{(() => {
							const ruleNamesWithMissing = getRuleNamesWithMissing()
							return ruleNamesWithMissing.length
								? ruleNamesWithMissing.map((dottedName) => (
										<li key={dottedName}>
											<RuleLinkWithContext dottedName={dottedName} />
										</li>
								  ))
								: 'Aucune autre règle ne dépend de la règle courante.'
						})()}
					</ul>
				</>
			)}
		</section>
	)
}

function NamespaceChildrenRules({
	dottedName,
	engine,
}: {
	dottedName: string
	engine: Engine
}) {
	const namespaceChildrenRules = Object.keys(engine.getParsedRules())
		.filter(
			(ruleDottedName) =>
				ruleDottedName.startsWith(dottedName) &&
				ruleDottedName.split(' . ').length ===
					dottedName.split(' . ').length + 1
		)
		.filter((rule) => utils.ruleWithDedicatedDocumentationPage(rule))
	if (!namespaceChildrenRules.length) {
		return null
	}
	return (
		<section>
			<h2>Règles enfants </h2>
			<ul>
				{namespaceChildrenRules.map((dottedName) => (
					<li key={dottedName}>
						<RuleLinkWithContext dottedName={dottedName} />
					</li>
				))}
			</ul>
		</section>
	)
}
