import { Form } from './FormView';
import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IOrderForm> {
	protected addressInput: HTMLInputElement;
	protected paymentCard: HTMLButtonElement;
	protected paymentCash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.container
		);
		this.paymentCard = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.container
		);
		this.paymentCash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.container
		);

		this.paymentCard.addEventListener('click', () => {
			this.events.emit('order:payment', { payment: 'card' });
		});

		this.paymentCash.addEventListener('click', () => {
			this.events.emit('order:payment', { payment: 'cash' });
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:address', { address: this.addressInput.value });
		});
	}

	set address(value: string) {
		this.addressInput.value = value;
	}

	set payment(value: 'card' | 'cash') {
		this.paymentCard.classList.toggle('button_alt-active', value === 'card');
		this.paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}
}
