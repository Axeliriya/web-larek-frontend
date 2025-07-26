import { IBasket } from '../../types';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { BasketItemView } from './BasketItemView';

export class Basket extends Component<IBasket> {
	private list: HTMLElement;
	private total: HTMLElement;
	private button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.list = ensureElement<HTMLElement>('.basket__list', container);
		this.total = ensureElement<HTMLElement>('.basket__price', container);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.button.addEventListener('click', () => this.events.emit('order:open'));
	}

	render(data: Partial<IBasket>): HTMLElement {
		this.list.replaceChildren();
		if (!data.items?.length) {
			this.list.textContent = 'Корзина пуста';
		} else {
			data.items.forEach((item, index) => {
				const cardElement = cloneTemplate('#card-basket');
				const itemView = new BasketItemView(
					cardElement,
					this.events,
					item.id,
					index + 1
				);
				itemView.render(item);
				this.list.append(itemView.container);
			});
		}
		this.setText(this.total, `${data.total} синапсов`);
		this.setDisabled(this.button, !data.items?.length);
		return this.container;
	}
}
