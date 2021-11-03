import Emoji from 'Components/utils/Emoji'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'

type GuideURSSAFCardProps = {
	guideUrssaf: {
		title: string
		url: string
	}
}

export function GuideURSSAFCard({ guideUrssaf }: GuideURSSAFCardProps) {
	return (
		<Card
			title={guideUrssaf.title}
			icon={<Emoji emoji="📖" />}
			callToAction={{
				href: guideUrssaf.url,
				label: 'Voir le guide',
			}}
		>
			<Body>
				Des conseils pour se lancer dans la création et une présentation
				détaillée de votre protection sociale.
			</Body>
		</Card>
	)
}
