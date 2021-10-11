import { InputProps } from '../RuleInput'

const STATES = [
	'Allemagne',
	'Andorre',
	'Argentine',
	'Autriche',
	'Belgique',
	'Brésil',
	'Bulgarie',
	'Canada',
	'Chili',
	'Chypre',
	'Corée du sud',
	'Croatie',
	'Danemark',
	'Espagne',
	'Estonie',
	'États-Unis',
	'Finlande',
	'Grèce',
	'Hongrie',
	'Inde',
	'Irlande',
	'Islande',
	'Italie',
	'Japon',
	'Lettonie',
	'Liechtenstein',
	'Lituanie',
	'Luxembourg',
	'Malte',
	'Maroc',
	'Norvège',
	'Nouvelle Calédonie',
	'Pays-Bas',
	'Pologne',
	'Polynésie',
	'Portugal',
	'Québec',
	'République Tchèque',
	'Roumanie',
	'Royaume-Uni',
	'Saint Pierre et Miquelon',
	'Slovaquie',
	'Slovénie',
	'Suède',
	'Suisse',
	'Tunisie',
	'Uruguay',
	'Autre',
] as const

export default function SelectPaysDétachement({
	value,
	onChange,
	id,
}: InputProps) {
	return (
		<div>
			<select
				name="country"
				id={id}
				className="ui__"
				defaultValue={value ? (value as string).slice(1, -1) : ''}
				onChange={(e) => onChange(`'${e.target.value}'`)}
			>
				<option disabled hidden></option>
				{STATES.map((state) => (
					<option key={state} value={state}>
						{state}
					</option>
				))}
			</select>
		</div>
	)
}
