const validators = {
	required: ['Обязательное поле', (value) => value !== ''],
	email: ['Неверный формат email', (value) => (typeof value === 'string') && value.includes('@')],
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
