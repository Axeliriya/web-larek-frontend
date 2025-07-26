import { CardView } from './CardView';
import { IEvents } from '../base/events';

export class BasketItemView extends CardView {
	public container: HTMLElement;
	constructor(
		container: HTMLElement,
		private events: IEvents,
		private id: string,
		index: number
	) {
		super(container);

		const indexEl = container.querySelector('.basket__item-index');

		if (indexEl) indexEl.textContent = String(index);

		const deleteButton = container.querySelector('.basket__item-delete');
		if (deleteButton) {
			deleteButton.addEventListener('click', () => {
				this.events.emit('basket:remove', { id: this.id });
			});
		}
	}
}
