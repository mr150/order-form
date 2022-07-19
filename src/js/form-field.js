export default class FormField extends HTMLElement {
	name = '';
	isValid = false;
	#validatorsMap = {};
	#errorMessages = [];

	connectedCallback() {
    this.input = this.querySelector('input');
    this.name = this.input.name;
    this.message = this.querySelector('.message');
	}

	set validators(value) {
		this.#errorMessages = Object.keys(value);
		this.#validatorsMap = value;
	}

	get validators() {
		return this.#validatorsMap;
	}

	validate() {
		const message = this.#errorMessages.find(
			(item) => this.#validatorsMap[item](this.input.value)
		);

		const isValid = !message;

		this.message.textContent = message;
		this.toggleAttribute('valid', isValid);
		this.toggleAttribute('invalid', !isValid);

		return this.isValid = isValid;
	}
}
