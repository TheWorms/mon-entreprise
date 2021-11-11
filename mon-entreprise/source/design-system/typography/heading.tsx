import styled, { css } from 'styled-components'

const baseHeading = css`
	font-family: 'Montserrat', sans-serif;
	font-weight: 700;
	scroll-margin-top: 1rem; /* Add a margin for anchor links */
	color: ${({ theme }) => theme.colors.bases.primary[700]};
`
const underline = css`
	::after {
		height: 1.25rem;
		width: 5rem;
		display: block;
		content: ' ';
		border-bottom: 4px solid ${({ theme }) => theme.colors.bases.secondary[500]};
	}
`
export const H1 = styled.h1`
	${baseHeading}
	font-size: 2rem;
	line-height: 2.375rem;
	${underline}
`

export const H2 = styled.h2`
	${baseHeading}
	font-size: 1.625rem;
	line-height: 2rem;
	${underline}
`

export const H3 = styled.h3`
	${baseHeading}
	font-size: 1.25rem;
	line-height: 1.5rem;
`

export const H4 = styled.h4`
	${baseHeading}
	font-size: 1.125rem;
	line-height: 1.5rem;
`

export const H5 = styled.h5`
	${baseHeading}
	font-size: 1rem;
	line-height: 1.5rem;
	text-transform: capitalize;
`

export const H6 = styled.h6`
	${baseHeading}
	font-size: 1rem;
	line-height: 1.5rem;
`
