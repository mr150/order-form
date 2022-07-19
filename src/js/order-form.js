const validation = {
	name: ['required', 'noLatin'],
	email: ['required', 'email'],
	phone: ['required', 'phone'],
};

export default class OrderForm extends HTMLElement {
	fields = {};
	#fieldNames = [];

	connectedCallback() {
    this.form = this.querySelector('form');
    this.btnSubmit = this.querySelector('[type="submit"]');
		this.querySelectorAll('form-field').forEach((item) => {
			if(item.name in validation) {
				item.validators = validation[item.name];
			}

			this.fields[item.name] = item;
			this.#fieldNames.push(item.name);
		});

		this.form.addEventListener('input', this.validate.bind(this), true);
	}

	validate(e) {
		if(e.target.tagName === 'INPUT') {
			this.fields[e.target.name].validate();

			this.btnSubmit.disabled = this.#fieldNames.some(
				(item) => !this.fields[item].valid
			);
		}
	}
}
