const messages = {
	required: 'Обязательное поле',
	email: 'Некорректный email',
	phone: 'Неверный формат телефона',
	noLatin: 'Разрешена только кириллица',
};

const regExp = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^\+[0-9][\s]?[0-9]{3}?[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$/,
	noLatin: /^[А-яёЁ]+$/,
}

export type Validator = keyof typeof messages;

const validators: {
	[key in Validator]: (value: unknown) => boolean
} = {
	required: (value) => value !== '',
	email: (value) => (typeof value === 'string') && regExp.email.test(value),
	phone: (value) => (typeof value === 'string') && regExp.phone.test(value),
	noLatin: (value) => (typeof value === 'string') && regExp.noLatin.test(value),
};

export function check(value: unknown, constraints: Validator[]): string | false {
	const name = constraints.find(
		(item) => !validators[item](value)
	);

	if(name !== undefined) {
		return messages[name];
	}

	return false;
}
