import { Form } from './FormView';
import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class ContactForm extends Form<IOrderForm> {
	protected phoneInput: HTMLInputElement;
	protected emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			this.container
		);
		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name=email]',
			this.container
		);

		this.emailInput.addEventListener('input', () => {
			this.events.emit('contacts:email', { email: this.emailInput.value });
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('contacts:phone', { phone: this.phoneInput.value });
		});
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}

	set email(value: string) {
		this.emailInput.value = value;
	}
}
