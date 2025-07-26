import { ICard } from '../../types';
import { IEvents } from '../base/events';

export class BasketModel {
	private _items: ICard[] = [];
	private _total = 0;
	private cards: ICard[];

	constructor(private events: IEvents, cards: ICard[]) {
		this.cards = cards;
	}

	addItem(id: string): void {
		const source = this.cards.find((item) => item.id === id);
		if (!source) return;

		source.inBasket = true;
		this._items.push(source);
		this.updateTotal();

		this.events.emit('basket:changed', {
			items: this._items,
			total: this._total,
		});
	}

	removeItem(id: string): void {
		const index = this._items.findIndex((item) => item.id === id);
		if (index === -1) return;

		const source = this.cards.find((item) => item.id === id);
		if (source) {
			source.inBasket = false;
		}
		this._items.splice(index, 1);
		this.updateTotal();

		this.events.emit('basket:changed', {
			items: this._items,
			total: this._total,
		});
	}

	clear(): void {
		this._items.forEach((item) => (item.inBasket = false));
		this._items = [];
		this._total = 0;
		this.events.emit('basket:changed', {
			items: this._items,
			total: this._total,
		});
	}

	get items(): ICard[] {
		return this._items;
	}

	get total(): number {
		return this._total;
	}

	get itemIds(): string[] {
		return this._items.map((item) => item.id);
	}

	private updateTotal(): void {
		this._total = this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}
}
