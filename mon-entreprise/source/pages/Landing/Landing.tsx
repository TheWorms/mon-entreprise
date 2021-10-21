import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card/Card'
import { Container } from 'DesignSystem/layout'
import { H1, H2 } from 'DesignSystem/typography/heading'
import { Body, Intro, SmallBody } from 'DesignSystem/typography/paragraphs'
import logoSvg from 'Images/logo.svg'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import BrexitPDF from './Brexit_guide.pdf'
import { CardSection } from './CardSection'
import illustrationSvg from './illustration.svg'
import './Landing.css'

export default function Landing() {
	const {
		t,
		i18n: { language },
	} = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	return (
		<Container>
			<TrackPage chapter1="informations" name="accueil" />
			<Header />
			{language === 'en' && (
				<div className="ui__ plain card" style={{ textAlign: 'center' }}>
					<Emoji emoji="🇬🇧" /> <strong>Brexit</strong> :{' '}
					<a href={BrexitPDF} target="_blank">
						Discover the impact on your social protection{' '}
					</a>
				</div>
			)}
			<section className="landing-title">
				<img
					alt="logo mon-entreprise.fr"
					className="landing-title__logo"
					src={logoSvg}
				/>
				<header>
					<H1>
						<Trans i18nKey="landing.title">
							L'assistant officiel de l'entrepreneur
						</Trans>
					</H1>
					<Intro>
						<Trans i18nKey="landing.subtitle">
							Les ressources nécessaires pour développer votre activité, du
							statut juridique à l'embauche.
						</Trans>
					</Intro>
				</header>
				<img src={illustrationSvg} className="landing-title__img" />
			</section>

			<CardSection>
				<Card
					icon={<Emoji emoji="💡" />}
					title={t('landing.choice.create.title', 'Créer une entreprise')}
					callToAction={
						statutChoisi
							? {
									to: sitePaths.créer[statutChoisi],
									label: t('Continuer'),
							  }
							: {
									to: sitePaths.créer.index,
									label: t('Commencer'),
							  }
					}
				>
					<Trans i18nKey="landing.choice.create.body">
						<SmallBody>
							Un accompagnement au choix du statut juridique et la liste
							complète des démarches de création
						</SmallBody>
					</Trans>
				</Card>
				<Card
					icon={<Emoji emoji="💶" />}
					title={t('landing.choice.manage.title', 'Gérer mon activité')}
					callToAction={{
						label: t('Commencer'),
						to: sitePaths.gérer.index,
					}}
				>
					<Trans i18nKey="landing.choice.manage.body">
						<SmallBody>
							Des outils personnalisés pour anticiper le montant des cotisations
							sociales à payer et mieux gérer votre trésorerie.
						</SmallBody>
					</Trans>
				</Card>
				<Card
					icon={<Emoji emoji="🧮" />}
					title={t(
						'landing.choice.simulators.title',
						'Accéder aux simulateurs'
					)}
					callToAction={{
						label: t('Découvrir'),
						to: sitePaths.simulateurs.index,
					}}
				>
					<Trans i18nKey="landing.choice.simulators.body">
						<SmallBody>
							La liste exhaustive de tous les simulateurs disponibles sur le
							site.
						</SmallBody>
					</Trans>
				</Card>
			</CardSection>
			<section>
				<Trans i18nKey="landing.aboutUs">
					<H2>Qui sommes-nous ?</H2>
					<Body>
						Nous sommes une petite{' '}
						<a href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe">
							équipe
						</a>{' '}
						autonome et pluridisciplinaire au sein de l’
						<a href="https://www.urssaf.fr">Urssaf</a>. Nous avons à cœur d’être
						au près de vos besoins afin d’améliorer en permanence ce site
						conformément à l'approche{' '}
						<a href="https://beta.gouv.fr/approche/manifeste">beta.gouv.fr</a>.
					</Body>
					<Body>
						Nous avons développé ce site pour{' '}
						<strong>accompagner les créateurs d’entreprise</strong> dans le
						développement de leur activité.
					</Body>

					<Body>
						Notre objectif est de{' '}
						<strong>
							lever toutes les incertitudes vis à vis de l’administration
						</strong>{' '}
						afin que vous puissiez vous concentrer sur ce qui compte : votre
						activité.
					</Body>
				</Trans>
			</section>
			<Footer />
		</Container>
	)
}
