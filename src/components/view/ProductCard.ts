import { CardView } from './CardView';
import { ICard } from '../../types';
import { IEvents } from '../base/events';

export class ProductCard extends CardView {
	private _cardId: string;
	private _description?: HTMLElement;
	private _button?: HTMLButtonElement;
	private _inBasket = false;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		container.addEventListener('click', () => {
			this.events.emit('product:select', { id: this.id });
		});

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				evt.stopPropagation();
				this.events.emit(this._inBasket ? 'card:remove' : 'basket:add', {
					id: this.id,
				});
			});
		}
	}

	set id(value: string) {
		this._cardId = value;
	}

	get id() {
		return this._cardId;
	}

	set inBasket(value: boolean) {
		this._inBasket = value;
		if (this._button) {
			this.setText(this._button, value ? 'Убрать' : 'В корзину');
		}
	}

	set price(price: number) {
		super.price = price;
		if (this._button) {
			this._button.style.display = price === null ? 'none' : '';
		}
	}

	set description(text: string) {
		if (this._description) {
			this.setText(this._description, text);
		}
	}

	render(cardData: Partial<ICard>): HTMLElement {
		if (cardData.id) this.id = cardData.id;
		if (cardData.title) this.title = cardData.title;
		if (cardData.category) this.category = cardData.category;
		if (cardData.price !== undefined) this.price = cardData.price;
		if (cardData.image) this.image = cardData.image;
		if (cardData.description) this.description = cardData.description;
		if (cardData.inBasket !== undefined) this.inBasket = cardData.inBasket;
		return this.container;
	}
}
