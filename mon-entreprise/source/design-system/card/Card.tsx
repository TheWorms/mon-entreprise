import { Button } from 'DesignSystem/buttons'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import { H3 } from 'DesignSystem/typography/heading'
import { ReactNode } from 'react'
import styled from 'styled-components'

type CardProps = {
	title: string
	icon?: ReactNode
	children: ReactNode
	callToAction: GenericButtonOrLinkProps & { label: string }
}

export const Card = ({
	title,
	icon,
	children,
	callToAction: { label, ...CTAProps },
}: CardProps) => {
	return (
		<StyledCardContainer>
			{icon && <IconContainer>{icon}</IconContainer>}
			<StyledHeader as="h2">{title}</StyledHeader>
			<CardBody>{children}</CardBody>
			<Button {...(CTAProps as any)} size="XS" light>
				{label}
			</Button>
		</StyledCardContainer>
	)
}

const StyledHeader = styled(H3)`
	text-align: center;
`

const IconContainer = styled.div`
	transform: scale(2.3);
	padding: 1rem;
`

const CardBody = styled.div`
	flex-grow: 1;
`

export const StyledCardContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: 0.375rem;
	box-shadow: ${({ theme }) => theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) => theme.elevations[3]};
	}
	padding: 1.5rem;
	width: 100%;
	height: 100%;
	transition: box-shadow 300ms;
`
