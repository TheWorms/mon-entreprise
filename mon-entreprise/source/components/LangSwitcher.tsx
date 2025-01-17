import { AvailableLangs } from 'locales/i18n'
import { useTranslation } from 'react-i18next'
import Emoji from './utils/Emoji'

const languageCodeToEmoji = {
	en: '🇬🇧',
	fr: '🇫🇷',
}

export default function LangSwitcher({ className }: { className: string }) {
	const { i18n } = useTranslation()
	const languageCode = i18n.language
	const unusedLanguageCode: AvailableLangs =
		!languageCode || languageCode === 'fr' ? 'en' : 'fr'
	const changeLanguage = () => {
		i18n.changeLanguage(unusedLanguageCode)
	}
	return (
		<button
			className={className ?? 'ui__ link-button'}
			onClick={changeLanguage}
		>
			<Emoji emoji={languageCodeToEmoji[languageCode as AvailableLangs]} />{' '}
			{languageCode.toUpperCase()}
		</button>
	)
}
