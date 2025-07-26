import { cloneTemplate } from './utils';
import { ICard } from '../types';
import { IEvents } from '../components/base/events';
import { ProductCard } from '../components/view/ProductCard';

export function createProductCard(
	cardData: ICard,
	events: IEvents,
	templateId: string
): HTMLElement {
	const element = cloneTemplate(templateId);
	const card = new ProductCard(element, events);
	return card.render({ ...cardData });
}
