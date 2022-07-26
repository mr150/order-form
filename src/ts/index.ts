import FormField from './form-field.js';
import OrderForm from './order-form.js';

declare global {
  interface HTMLElementTagNameMap {
		'form-field': FormField;
		'order-form': OrderForm;
  }
}

customElements.define('form-field', FormField);
customElements.define('order-form', OrderForm);
