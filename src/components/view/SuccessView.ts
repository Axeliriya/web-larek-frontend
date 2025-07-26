import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<{ total: number }> {
	private description: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', () =>
			this.events.emit('success:close')
		);
	}

	render(data: Partial<{ total: number }>): HTMLElement {
		this.setText(this.description, `Списано ${data.total} синапсов`);
		return this.container;
	}
}
