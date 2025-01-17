import FocusTrap from 'focus-trap-react'
import { PageInfo } from 'iframe-resizer'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { FromBottom } from './ui/animate'

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	xPosition?: number
	children: React.ReactNode
}

const useIFrameOffset = () => {
	const [offsetTop, setOffset] = useState<number | null>(null)
	useEffect(() => {
		if (!('parentIFrame' in window)) {
			setOffset(0)
			return
		}
		window.parentIFrame.getPageInfo(({ scrollTop, offsetTop }: PageInfo) => {
			setOffset(scrollTop - offsetTop)
			window.parentIFrame.getPageInfo(false)
		})
	}, [])
	return offsetTop
}

export default function Overlay({
	onClose,
	children,
	className,
	...otherProps
}: OverlayProps) {
	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('no-scroll')
		return () => {
			body.classList.remove('no-scroll')
		}
	}, [])
	const offsetTop = useIFrameOffset()

	if (offsetTop === null) {
		return null
	}
	return (
		<StyledOverlayWrapper offsetTop={Math.max(0, offsetTop)}>
			<div className="overlayContent">
				<FromBottom>
					<FocusTrap
						focusTrapOptions={{
							onDeactivate: onClose,
							clickOutsideDeactivates: !!onClose,
						}}
					>
						<div
							aria-modal="true"
							className={'ui__ card  ' + className ?? ''}
							{...otherProps}
						>
							{children}
							{onClose && (
								<button
									aria-label="Fermer"
									onClick={onClose}
									className="overlayCloseButton"
								>
									×
								</button>
							)}
						</div>
					</FocusTrap>
				</FromBottom>
			</div>
		</StyledOverlayWrapper>
	)
}

const StyledOverlayWrapper = styled.div<{ offsetTop: number | null }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	max-height: 100vh;
	background: rgba(255, 255, 255, 0.9);
	overflow: auto;
	z-index: 2;
	.overlayContent {
		${({ offsetTop }) =>
			offsetTop
				? css`
						transform: translateY(${offsetTop}px);
				  `
				: css`
						bottom: 0;
						max-height: 80vh;
				  `}
		position: absolute;
	}
	.overlayCloseButton {
		position: fixed;
		background-color: white;
		border-top-left-radius: 100%;
		text-decoration: none;
		font-size: 2.5rem;
		border-top: 0.5rem solid white;
		border-left: 0.5rem solid white;
		bottom: 0;
		right: 0;
		color: var(--lighterTextColor);
		padding: 0 1rem;
		text-decoration: none;
	}
	.ui__.card[aria-modal='true'] {
		padding-bottom: 4rem;
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 600px) {
		.overlayContent {
			width: 100%;
		}
		.overlayCloseButton {
			position: fixed;
			bottom: 0;
			right: 0;
			line-height: 1rem;
			padding: 1.2rem;
			padding-bottom: 1.5rem;
			font-size: 3rem;
			background: var(--lighterColor);
		}
	}

	@media (min-width: 600px) {
		.overlayCloseButton {
			position: absolute;
			top: 0;
			bottom: auto;
			right: 0;
			padding: 0 0.5rem;
			font-size: 2rem;
		}
		.overlayContent {
			transform: translateX(-50%)
				translateY(calc(${({ offsetTop }) => offsetTop}px + 5rem));
			left: 50%;
			width: 80%;
			bottom: auto;
			height: auto;
			max-width: 40em;
			min-height: 6em;
		}
		.ui__.card[aria-modal='true'] {
			padding-bottom: 2rem;
			margin-bottom: 2rem;
		}
	}
`
