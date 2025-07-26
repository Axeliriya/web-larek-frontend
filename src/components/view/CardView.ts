import { Component } from '../base/Component';
import { ICard } from '../../types';

export class CardView extends Component<ICard> {
	protected _title: HTMLElement | null;
	protected _category: HTMLElement | null;
	protected _price: HTMLElement | null;
	protected _image: HTMLImageElement | null;

	constructor(protected container: HTMLElement) {
		super(container);
		this._title = container.querySelector('.card__title');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._image = container.querySelector('.card__image');
	}

	set title(value: string) {
		if (this._title) this.setText(this._title, value);
	}

	set category(value: string) {
		if (this._category) {
			this._category.classList.forEach((cls) => {
				if (cls.startsWith('card__category_')) {
					this._category.classList.remove(cls);
				}
			});

			let normalized: string;

			switch (value) {
				case 'софт-скил':
					normalized = 'soft';
					break;
				case 'другое':
					normalized = 'other';
					break;
				case 'дополнительно':
					normalized = 'additional';
					break;
				case 'кнопка':
					normalized = 'button';
					break;
				case 'хард-скил':
					normalized = 'hard';
					break;
				default:
					normalized = 'other';
			}

			this._category.classList.add(`card__category_${normalized}`);

			this.setText(this._category, value);
		}
	}

	set price(price: number | null) {
		if (this._price) {
			this.setText(
				this._price,
				price === null ? 'Бесценно' : `${price} синапсов`
			);
		}
	}

	set image(src: string) {
		if (this._image) this.setImage(this._image, src);
	}
}
