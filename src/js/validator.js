const validators = {
	required: ['Обязательное поле', (value) => value !== ''],
	email: [
		'Некорректный email',
		(value) => (typeof value === 'string') && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	],
	phone: [
		'Неверный формат телефона',
		(value) => (typeof value === 'string') && value.match(/^\+[0-9][\s]?[0-9]{3}?[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$/)
	],
	noLatin: [
		'Разрешена только кириллица',
		(value) => (typeof value === 'string') && value.match(/^[А-яёЁ]+$/)
	],
};

export function check(value, constraints) {
	const name = constraints.find(
		(item) => !validators[item][1](value)
	);

	if(name !== undefined) {
		return validators[name][0];
	}

	return false;
}
