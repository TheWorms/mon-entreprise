import { Grid } from '@mui/material'
import { H1 } from 'DesignSystem/typography/heading'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Illustration = styled.img<{ titre: ReactNode }>`
	height: 100%;
	width: 100%;

	padding-top: ${({ theme }) => theme.spacings.xl};
	/* transform-origin: center right;
	transform: scale(1.25); */
`

export default function PageHeader({
	titre,
	children,
	picture,
}: {
	titre?: ReactNode
	children: ReactNode
	picture?: string
}) {
	return (
		<Grid container spacing={3} alignItems="center">
			<Grid
				item
				sm={12}
				md={9}
				lg={8}
				xl={7}
				css={`
					display: flex;
					flex-direction: column;
					align-items: flex-start;
				`}
			>
				{titre && <H1>{titre}</H1>}
				{children}
			</Grid>

			{picture && (
				<Grid
					item
					className="hide-mobile"
					md={3}
					lg={4}
					xl={5}
					sx={{ zIndex: '-1', display: { xs: 'none', md: 'block' } }}
				>
					<Illustration
						className="hide-mobile"
						titre={titre}
						src={picture}
						alt={`${titre}`}
					/>
				</Grid>
			)}
		</Grid>
	)
}
