const validation = {
	name: ['required'],
	email: ['required', 'email'],
	phone: ['required'],
	address: ['required'],
};

export default class OrderForm extends HTMLElement {
	fields = {};
	#fieldNames = [];

	connectedCallback() {
    this.form = this.querySelector('form');
    this.btnSubmit = this.querySelector('[type="submit"]');
		this.querySelectorAll('form-field').forEach((item) => {
			item.validators = validation[item.name];
			this.fields[item.name] = item;
			this.#fieldNames.push(item.name);
		});

		this.form.addEventListener('input', this.validate.bind(this), true);
	}

	validate(e) {
		if(e.target.tagName === 'INPUT') {
			this.fields[e.target.name].validate();
			this.checkValidity();
		}
	}

	checkValidity() {
		const isFormInvalid = this.#fieldNames.some(
			(item) => !this.fields[item].isValid
		);

		this.btnSubmit.disabled = isFormInvalid;

		return !isFormInvalid;
	}
}
