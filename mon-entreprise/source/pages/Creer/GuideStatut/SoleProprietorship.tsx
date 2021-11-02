import {
	isSoleProprietorship,
	useDispatchAndGoToNextQuestion,
} from 'Actions/companyStatusActions'
import { H2 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { Ul, Li } from 'DesignSystem/typography/list'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'
import AnswerGroup from 'DesignSystem/answer-group'
import { Button } from 'DesignSystem/buttons'

export default function SoleProprietorship() {
	const dispatch = useDispatchAndGoToNextQuestion()
	const { t } = useTranslation()
	return (
		<>
			<TrackPage name="societe_ou_entreprise_individuelle" />
			<Helmet>
				<title>
					{t([
						'responsabilité.page.titre',
						'Choisir entre société ou entreprise individuelle',
					])}
				</title>
				<meta
					name="description"
					content={t(
						'responsabilité.description',
						`
						Responsabilité limitée ? entreprise individuelle ? Chaque option a
						des implications juridiques et conduit à un statut différent pour la
						création de votre entreprise en France. Ce guide vous aide à choisir
						entre les différentes forme de responsabilité.
					`
					)}
				/>
			</Helmet>
			<H2>
				<Trans i18nKey="responsabilité.titre">
					Entreprise individuelle ou société ?
				</Trans>
			</H2>
			<Body>
				<Trans i18nKey="responsabilité.intro">
					Ce choix determine votre degré de responsabilité et votre capacité à
					accueillir de nouveaux associés dans le futur{' '}
				</Trans>
				:
			</Body>
			<Ul>
				<Li>
					<Trans i18nKey="responsabilité.entreprise-individuelle">
						<strong>Entreprise individuelle : </strong>
						Une activité économique exercée par une seule personne physique, en
						son nom propre. Moins de formalités, mais plus de risques en cas de
						faillite, car votre patrimoine personnel peut être mis à
						contribution.{' '}
						<strong>
							Vous ne pouvez pas accueillir de nouveaux associés en entreprise
							individuelle.
						</strong>
					</Trans>
				</Li>

				<Li>
					<Trans i18nKey="responsabilité.société">
						<strong>Société : </strong>
						Vous ne pouvez pas être tenu personnellement responsable des dettes
						ou obligations de la société. En revanche, les démarches de création
						sont un peu plus lourdes, puisqu'elles incluent notamment la
						rédaction de statuts et le dépôt d'un capital.
					</Trans>
				</Li>
			</Ul>
			<AnswerGroup>
				{[
					<Button
						key="isSoleProprietorship"
						onClick={() => {
							dispatch(isSoleProprietorship(true))
						}}
					>
						<Trans i18nKey="responsabilité.bouton2">
							Entreprise individuelle
						</Trans>
					</Button>,
					<Button
						key="isNotSoleProprietorship"
						onClick={() => {
							dispatch(isSoleProprietorship(false))
						}}
					>
						<Trans i18nKey="responsabilité.bouton1">Société</Trans>
					</Button>,
				]}
			</AnswerGroup>
			{/* this is an economic activity conducted by a single natural person, in his own name ; */}
			{/* Company  : This is an economic activity conducted by a single partner - single member company with limited liability (EURL) - or several partners (limited liability company (SARL), public limited company (SA), simplified joint-stock company (SAS)...). */}
		</>
	)
}
