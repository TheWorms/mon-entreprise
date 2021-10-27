import { useButton } from '@react-aria/button'
import { AriaButtonProps } from '@react-types/button'
import { ReactEventHandler, useRef } from 'react'
import styled, { DefaultTheme } from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonVisualProps = {
	color: Color
	size: Size
	onClick?: ReactEventHandler
}
type ButtonProps = {
	light?: boolean
} & ButtonVisualProps &
	AriaButtonProps<'button'>

export const Button = (props: ButtonProps) => {
	const { children, color, size, light = false, onClick } = props
	const buttonRef = useRef<HTMLButtonElement>(null)
	const buttonProps = useButton(props, buttonRef)

	return light ? (
		<StyledLightButton
			{...buttonProps}
			ref={buttonRef}
			color={color}
			size={size}
			onClick={onClick}
		>
			{children}
		</StyledLightButton>
	) : (
		<StyledButton
			{...buttonProps}
			ref={buttonRef}
			color={color}
			size={size}
			onClick={onClick}
		>
			{children}
		</StyledButton>
	)
}

const StyledButton = styled.button<ButtonVisualProps>`
	background-color: ${({ theme, color }) =>
		theme.colors.bases[color][color === 'primary' ? 700 : 300]};
	color: ${({ theme, color }) =>
		theme.colors.extended.grey[color === 'primary' ? 100 : 800]};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};

	border-radius: 2.5rem;
	font-size: 1rem;
	line-height: 1.5rem;

	&:hover {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 800 : color === 'secondary' ? 500 : 400
			]};
	}

	&:disabled {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][color === 'primary' ? 200 : 100]};
		color: ${({ theme, color }) =>
			theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
	}
`

const StyledLightButton = styled.button<ButtonVisualProps>`
	border: 2px solid
		${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 700 : color === 'secondary' ? 500 : 300
			]};
	color: ${({ theme, color }) =>
		theme.colors.bases[color][color === 'primary' ? 700 : 700]};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};

	border-radius: 2.5rem;
	font-size: 1rem;
	line-height: 1.5rem;

	&:hover {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 200 : color === 'secondary' ? 100 : 100
			]};
	}

	&:disabled {
		border-color: ${({ theme, color }) =>
			theme.colors.bases[color][color === 'primary' ? 200 : 100]};
		color: ${({ theme, color }) =>
			theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
	}
`
