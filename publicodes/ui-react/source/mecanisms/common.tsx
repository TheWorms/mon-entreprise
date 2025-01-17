import { capitalise0, formatValue, simplifyNodeUnit } from 'publicodes'
import {
	EvaluatedNode,
	Evaluation,
	Types,
	Unit,
} from 'publicodes/source/AST/types'
import { ReferenceNode } from 'publicodes/source/reference'
import React, { createContext, useContext, useState } from 'react'
import styled from 'styled-components'
import { EngineContext } from '../contexts'
import mecanismsDoc from '../data/mecanisms.json'
import Explanation from '../Explanation'
import { Markdown } from '../Markdown'
import Overlay from '../Overlay'
import { RuleLinkWithContext } from '../RuleLink'
import mecanismColors from './colors'

export function ConstantNode({ nodeValue, type, fullPrecision, unit }) {
	if (nodeValue === null) {
		return null
	} else if (type === 'objet') {
		return (
			<code>
				<pre>{JSON.stringify(nodeValue, null, 2)}</pre>
			</code>
		)
	} else if (fullPrecision) {
		return (
			<span className={type}>
				{formatValue(
					{ nodeValue, unit },
					{
						precision: 5,
					}
				)}
			</span>
		)
	} else {
		return <span className="value">{formatValue({ nodeValue, unit })}</span>
	}
}

type NodeValuePointerProps = {
	data: Evaluation<Types>
	unit: Unit | undefined
}

export const NodeValuePointer = ({ data, unit }: NodeValuePointerProps) => {
	const engine = useContext(EngineContext)
	return (
		<small
			className="nodeValue"
			style={{
				background: 'white',
				borderBottom: '0 !important',
				margin: '0 0.2rem',
				padding: '0 0.2rem',
				textDecoration: 'none !important',
				boxShadow: '0px 1px 2px 1px #d9d9d9, 0 0 0 1px #d9d9d9',
				lineHeight: '1.6em',
				borderRadius: '0.2rem',
			}}
		>
			{formatValue(simplifyNodeUnit({ nodeValue: data, unit }), {
				formatUnit: engine?.getOptions()?.formatUnit,
			})}
		</small>
	)
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
type NodeProps = {
	name: string
	value: Evaluation<Types>
	unit?: Unit
	children: React.ReactNode
	displayName?: boolean
}

export function Mecanism({
	name,
	value,
	children,
	unit,
	displayName = true,
}: NodeProps) {
	return (
		<StyledMecanism name={name}>
			{displayName && <MecanismName name={name}>{name}</MecanismName>}
			<>
				{children}

				{value != null && (
					<div
						style={{
							textAlign: 'right',
							marginTop: '0.4rem',
							fontWeight: 'bold',
						}}
					>
						<small> =&nbsp;</small>
						<NodeValuePointer data={value} unit={unit} />
					</div>
				)}
			</>
		</StyledMecanism>
	)
}

export const InfixMecanism = ({
	value,
	prefixed,
	children,
	dimValue,
}: {
	value: EvaluatedNode
	children: React.ReactNode
	prefixed?: boolean
	dimValue?: boolean
}) => {
	return (
		<StyledInfixMecanism className="infix-mecanism">
			{prefixed && children}
			<div
				className="value"
				style={{
					position: 'relative',
				}}
			>
				{dimValue && <DimOverlay />}
				<Explanation node={value} />
			</div>
			{!prefixed && children}
		</StyledInfixMecanism>
	)
}
const DimOverlay = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	background-color: white;
	left: 0;
	opacity: 0.5;
	pointer-events: none;
	z-index: 1;
`

const StyledInfixMecanism = styled.div`
	.value > .infix-mecanism {
		border: none;
		padding: 0;
	}
	.value > :not(.infix-mecanism):not(${DimOverlay}) {
		margin-bottom: 1rem;
	}
`

export const InlineMecanismName = ({ name }: { name: string }) => {
	return (
		<MecanismName inline name={name}>
			{name}
		</MecanismName>
	)
}

const MecanismName = ({
	name,
	inline = false,
	children,
}: {
	name: string
	inline?: boolean
	children: React.ReactNode
}) => {
	const [showExplanation, setShowExplanation] = useState(false)

	return (
		<>
			<StyledMecanismName
				name={name}
				inline={inline}
				onClick={() => setShowExplanation(true)}
			>
				{children}
			</StyledMecanismName>
			{showExplanation && (
				<Overlay onClose={() => setShowExplanation(false)}>
					<RuleExplanation name={name} {...mecanismsDoc[name]} />
				</Overlay>
			)}
		</>
	)
}

type RuleExplanationProps = {
	exemples: { base: string }
	description: string
	name: string
}

export default function RuleExplanation({
	name,
	description,
	exemples,
}: RuleExplanationProps) {
	return (
		<>
			{!!name && (
				<h2 id={name}>
					<pre>{name}</pre>
				</h2>
			)}
			<Markdown source={description} />
			{exemples && (
				<>
					{Object.entries(exemples).map(([name, exemple]) => (
						<React.Fragment key={name}>
							<h3>{name === 'base' ? 'Exemple' : capitalise0(name)}</h3>
							<Markdown source={`\`\`\`yaml\n${exemple}\n\`\`\``} />
						</React.Fragment>
					))}{' '}
				</>
			)}
		</>
	)
}

const StyledMecanism = styled.div<{ name: string }>`
	border: 1px solid;
	max-width: 100%;
	border-radius: 3px;
	padding: 1rem;
	position: relative;
	flex: 1;
	flex-direction: column;
	border-color: ${({ name }) => mecanismColors(name)};

	.key {
		font-weight: bold;
	}
`

const StyledMecanismName = styled.button<{ name: string; inline?: boolean }>`
	background-color: ${({ name }) => mecanismColors(name)};
	font-size: inherit;
	font-weight: inherit;
	font-family: inherit;
	padding: 0.4rem 0.6rem;
	color: white;
	transition: hover 0.2s;
	${(props) =>
		props.inline
			? `
		display: inline-block;
		border-radius: 0.3rem;
		`
			: `
		margin-bottom: 0.8rem;
		display: block;

		margin-top: -1rem;
		margin-left: -1rem;
		border-bottom-right-radius: 0.3rem;
		::first-letter {
			text-transform: capitalize;
		}
	`}
	:hover {
		opacity: 0.8;
	}
`

export const CapitalizeFirstLetter = styled.div`
	font-weight: bold;
	:first-letter {
		text-transform: capitalize;
	}
`

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export function Leaf(
	node: ReferenceNode & {
		dottedName: string
	} & EvaluatedNode
) {
	const engine = useContext(EngineContext)
	const { dottedName, nodeValue, unit } = node
	const rule = engine?.getRule(node.dottedName)
	if (!rule) {
		throw new Error('Unknown node')
	}
	const [folded, setFolded] = useState(true)
	const foldButton = useContext(UnfoldIsEnabledContext) ? (
		<UnfoldButton
			onClick={() => setFolded(!folded)}
			className="ui__ notice small static simple button"
		>
			{folded ? 'déplier' : 'replier'}
		</UnfoldButton>
	) : null
	if (
		node.dottedName === node.contextDottedName + ' . ' + node.name &&
		!node.name.includes(' . ') &&
		rule.virtualRule
	) {
		return <Explanation node={engine?.evaluate(rule)} />
	}
	return (
		<div style={{ display: 'inline' }}>
			<span>
				<RuleLinkWithContext dottedName={dottedName}>
					<span className="name">
						{rule.rawNode.acronyme ? (
							<abbr title={rule.title}>{rule.rawNode.acronyme}</abbr>
						) : (
							rule.title
						)}
					</span>
				</RuleLinkWithContext>
				{foldButton}

				{nodeValue !== null && unit && (
					<NodeValuePointer data={nodeValue} unit={unit} />
				)}
			</span>{' '}
			{!folded && (
				<div
					style={{
						width: '100%',
					}}
				>
					<UnfoldIsEnabledContext.Provider value={false}>
						<Explanation node={engine?.evaluate(rule)} />
					</UnfoldIsEnabledContext.Provider>
				</div>
			)}
		</div>
	)
}

export const UnfoldIsEnabledContext = createContext<boolean>(false)

const UnfoldButton = styled.button`
	text-transform: none !important;
	flex: 1 !important;
	margin-left: 0.4rem !important;
	text-align: left !important;
`
