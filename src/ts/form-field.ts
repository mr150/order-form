import { check, Validator } from './validator.js';

export default class FormField extends HTMLElement {
	name = '';
	validators: Validator[] = [];
	#isValid = false;
	input!: HTMLInputElement;
	message!: HTMLElement;

	connectedCallback() {
    this.input = this.querySelector('input')!;
    this.name = this.input.name;
    this.message = this.querySelector('.message')!;
	}

	get valid() {
		return this.#isValid || !this.validators.length;
	}

	validate(): boolean {
		if(!this.validators.length) {
			return true;
		}

		const message = check(this.input.value, this.validators);
		const isValid = !message;

		this.message.textContent = message || '';
		this.toggleAttribute('valid', isValid);
		this.toggleAttribute('invalid', !isValid);

		return this.#isValid = isValid;
	}
}
