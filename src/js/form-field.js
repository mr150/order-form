import { check } from './validator.min.js';

export default class FormField extends HTMLElement {
	name = '';
	isValid = false;
	validators = [];

	connectedCallback() {
    this.input = this.querySelector('input');
    this.name = this.input.name;
    this.message = this.querySelector('.message');
	}

	validate() {
		const message = check(this.input.value, this.validators);
		const isValid = !message;

		this.message.textContent = message;
		this.toggleAttribute('valid', isValid);
		this.toggleAttribute('invalid', !isValid);

		return this.isValid = isValid;
	}
}
