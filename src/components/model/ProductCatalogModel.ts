import { ICard, ICardsData } from '../../types';
import { IEvents } from '../base/events';

export class ProductCatalogModel implements ICardsData {
	protected _products: ICard[];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._products = [];
	}

	get cards() {
		return this._products;
	}

	set cards(products: ICard[]) {
		this._products = products;
		this.events.emit('initialData:loaded');
	}

	getCard(cardId: string): ICard | null {
		return this._products.find((item) => item.id === cardId) || null;
	}
}
