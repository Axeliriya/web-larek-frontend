import { IEvents } from '../base/events';
import { AppApi } from '../base/AppApi';
import { ProductCatalogModel } from '../model/ProductCatalogModel';
import { BasketModel } from '../model/BasketModel';
import { OrderModel } from '../model/OrderModel';
import { Page } from '../view/Page';
import { Modal } from '../view/ModalView';
import { ProductCard } from '../view/ProductCard';
import { Basket } from '../view/BasketView';
import { OrderForm } from '../view/OrderForm';
import { ContactForm } from '../view/ContactForm';
import { SuccessView } from '../view/SuccessView';
import { IBasket, FormErrors } from '../../types';
import { cloneTemplate, createElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { createProductCard } from '../../utils/CardFactory';

export class AppPresenter {
	private page: Page;
	private modal: Modal;
	private basket: Basket;
	private orderForm: OrderForm;
	private contactForm: ContactForm;
	private success: SuccessView;
	private basketModel: BasketModel;
	private orderModel: OrderModel;

	constructor(
		private api: AppApi,
		private productCatalog: ProductCatalogModel,
		private events: IEvents
	) {
		this.page = new Page(document.body, events);
		this.modal = new Modal(document.querySelector('#modal-container'), events);
		this.basket = new Basket(cloneTemplate('#basket'), events);
		this.orderForm = new OrderForm(cloneTemplate('#order'), events);
		this.contactForm = new ContactForm(cloneTemplate('#contacts'), events);
		this.success = new SuccessView(cloneTemplate('#success'), events);
		this.orderModel = new OrderModel(api, events);

		this.setupEventListeners();
		this.fetchCards();
	}

	private async fetchCards(): Promise<void> {
		try {
			const cards = await this.api.getCards();
			this.productCatalog.cards = cards.map((card) => ({
				...card,
				image: `${CDN_URL}${card.image}`,
				inBasket: false,
			}));
			this.basketModel = new BasketModel(
				this.events,
				this.productCatalog.cards
			);
		} catch (error) {
			const errorMessage = (error as Error).message || 'Неизвестная ошибка';
			this.modal.open(
				createElement('div', {
					textContent: `Ошибка загрузки товаров: ${errorMessage}`,
				})
			);
		}
	}

	private renderCatalog(): void {
		const cardsArray = this.productCatalog.cards.map((card) =>
			createProductCard(card, this.events, '#card-catalog')
		);
		this.page.gallery = cardsArray.length
			? cardsArray
			: [createElement('div', { textContent: 'Товары не найдены' })];
		this.page.counter = this.basketModel?.items.length ?? 0;
	}

	private setupEventListeners(): void {
		this.events.on('initialData:loaded', () => {
			this.renderCatalog();
		});

		this.events.on('product:select', ({ id }: { id: string }) => {
			const cardData = this.productCatalog.getCard(id);
			if (!cardData) return;

			const cardElement = cloneTemplate('#card-preview');
			const card = new ProductCard(cardElement, this.events);
			this.modal.open(card.render(cardData));
		});

		this.events.on('basket:add', ({ id }: { id: string }) => {
			this.basketModel.addItem(id);
			this.modal.close();
		});

		this.events.on('basket:remove', ({ id }: { id: string }) => {
			this.basketModel.removeItem(id);
		});

		this.events.on('card:remove', ({ id }: { id: string }) => {
			this.basketModel.removeItem(id);
			this.modal.close();
		});

		this.events.on('basket:changed', (data: IBasket) => {
			this.basket.render(data);
			this.page.counter = data.items.length;
			this.renderCatalog();
		});

		this.events.on('basket:open', () => {
			const basketData: IBasket = {
				items: this.basketModel.items,
				total: this.basketModel.total,
			};
			this.modal.open(this.basket.render(basketData));
		});

		this.events.on('order:open', () => {
			this.orderModel.clear();

			const order = this.orderModel.getOrder(
				this.basketModel.itemIds,
				this.basketModel.total
			);

			this.orderModel.validateOrder();
			this.modal.open(
				this.orderForm.render({
					...order,
					valid: false,
					errors: '',
				})
			);
		});

		this.events.on('order:payment', (data: { payment: 'card' | 'cash' }) => {
			this.orderModel.setOrderField('payment', data.payment);
			this.orderForm.payment = data.payment;
		});

		this.events.on('order:address', (data: { address: string }) => {
			this.orderModel.setOrderField('address', data.address);
			this.orderForm.address = data.address;
		});

		this.events.on(
			'order:valid',
			(data: { isValid: boolean; errors: FormErrors }) => {
				this.orderForm.valid = data.isValid;
				const errorMessage = data.errors.address || data.errors.payment || '';
				this.orderForm.errors = errorMessage;
			}
		);

		this.events.on('order:error', (data: { error: string }) => {
			this.orderForm.errors = data.error;
		});

		this.events.on('order:submit', () => {
			const order = this.orderModel.getOrder(
				this.basketModel.itemIds,
				this.basketModel.total
			);
			this.orderModel.validateContacts();
			this.modal.open(
				this.contactForm.render({
					...order,
					valid: false,
					errors: '',
				})
			);
		});

		this.events.on('contacts:email', (data: { email: string }) => {
			this.orderModel.setOrderField('email', data.email);
			this.contactForm.email = data.email;
		});

		this.events.on('contacts:phone', (data: { phone: string }) => {
			this.orderModel.setOrderField('phone', data.phone);
			this.contactForm.phone = data.phone;
		});

		this.events.on(
			'contacts:valid',
			(data: { isValid: boolean; errors: FormErrors }) => {
				this.contactForm.valid = data.isValid;
				const emailError = data.errors.email || '';
				const phoneError = data.errors.phone || '';

				let errorMessage = '';

				if (emailError && phoneError) {
					errorMessage = `${emailError}; ${phoneError}`;
				} else if (emailError) {
					errorMessage = emailError;
				} else if (phoneError) {
					errorMessage = phoneError;
				} else {
					errorMessage = '';
				}

				this.contactForm.errors = errorMessage;
			}
		);

		this.events.on('contacts:submit', () => {
			this.orderModel.submitOrder(
				this.basketModel.itemIds,
				this.basketModel.total
			);
		});

		this.events.on('order:success', (data: { total: number }) => {
			this.basketModel.clear();
			this.modal.open(this.success.render({ total: data.total }));
		});

		this.events.on('success:close', () => {
			this.modal.close();
		});

		this.events.on('page:locked', (data: { locked: boolean }) => {
			this.page.locked = data.locked;
		});
	}
}
