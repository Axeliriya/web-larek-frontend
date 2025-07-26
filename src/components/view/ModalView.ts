import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<unknown> {
	private content: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.content = ensureElement<HTMLElement>('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (event) => event.stopPropagation());

		this.handleEsc = this.handleEsc.bind(this);
	}

	open(content: HTMLElement): void {
		if (!content) return;
		this.content.replaceChildren(content);
		this.container.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEsc);
		this.events.emit('modal:open');
		this.events.emit('page:locked', { locked: true });
	}

	close(): void {
		this.content.innerHTML = '';
		this.container.classList.remove('modal_active');
		document.removeEventListener('keyup', this.handleEsc);
		this.events.emit('modal:close');
		this.events.emit('page:locked', { locked: false });
	}

	handleEsc(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}
