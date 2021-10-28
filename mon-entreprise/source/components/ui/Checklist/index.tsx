import { Markdown } from 'Components/utils/markdown'
import { ScrollToElement } from 'Components/utils/Scroll'
import { Link } from 'DesignSystem/typography/link'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import React, { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { Appear } from '../animate'
import Checkbox from '../Checkbox'
import './index.css'

type CheckItemProps = {
	title: React.ReactNode
	name: string
	explanations?: React.ReactNode
	onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
	defaultChecked?: boolean
}

const CheckItemHeader = styled.div`
	display: flex;
	width: 100%;
`

const Spacer = styled.div`
	flex-grow: 1;
`

export function CheckItem({
	title,
	name,
	explanations,
	onChange,
	defaultChecked,
}: CheckItemProps) {
	const [displayExplanations, setDisplayExplanations] = useState(false)

	const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setDisplayExplanations(false)
		}
		onChange?.(e)
	}

	const handleClick = () => {
		setDisplayExplanations(!displayExplanations)
	}

	return (
		<ScrollToElement
			onlyIfNotVisible
			when={displayExplanations}
			style={{ width: '100%' }}
		>
			<CheckItemHeader>
				{/* TODO ACCESSIBILITY: impossible to tick the checkbox with keyboard ?  */}
				<Checkbox
					name={name}
					id={name}
					onChange={handleChecked}
					defaultChecked={defaultChecked}
					label={title}
				/>

				<Spacer></Spacer>

				{explanations && (
					<Link onClick={handleClick}>
						{displayExplanations ? (
							<Trans i18nKey="checklist.showmore.open">
								Masquer les détails
							</Trans>
						) : (
							<Trans i18nKey="checklist.showmore.closed">En savoir plus</Trans>
						)}
					</Link>
				)}
			</CheckItemHeader>
			{displayExplanations && explanations && (
				<Appear>
					{typeof explanations === 'string' ? (
						<Markdown source={explanations} />
					) : (
						explanations
					)}
				</Appear>
			)}
		</ScrollToElement>
	)
}

export type ChecklistProps = {
	children: React.ReactNode
	onItemCheck?: (name: string, isChecked: boolean) => void
	onInitialization?: (arg: Array<string>) => void
	defaultChecked?: { [key: string]: boolean }
}
export function Checklist({
	children,
	onItemCheck,
	onInitialization,
	defaultChecked,
}: ChecklistProps) {
	const checklist = React.Children.toArray(children)
		.filter(Boolean)
		.map((child) => {
			if (!React.isValidElement(child)) {
				throw new Error('Invalid child passed to Checklist')
			}
			return React.cloneElement(child, {
				onChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
					onItemCheck?.(child.props.name, evt.target.checked),
				defaultChecked:
					child.props.defaultChecked || defaultChecked?.[child.props.name],
			})
		})

	useEffect(() => {
		onInitialization?.(checklist.map((child) => child.props.name))
	}, [])

	return (
		<StyledList>
			{checklist.map((checkItem) => (
				<StyledListItem key={checkItem.props.name}>{checkItem}</StyledListItem>
			))}
		</StyledList>
	)
}

const StyledList = styled.ul`
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledListItem = styled.li`
	display: flex;
	flex-direction: row;
`
