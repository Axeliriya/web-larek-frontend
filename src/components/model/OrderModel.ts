import { IOrder, IApiError, FormErrors } from '../../types';
import { IEvents } from '../base/events';
import { AppApi } from '../base/AppApi';

type PartialOrder = Omit<IOrder, 'items' | 'total'>;

export class OrderModel {
	private order: PartialOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};

	private errors: FormErrors = {};

	constructor(private api: AppApi, private events: IEvents) {}

	setOrderField(
		field: keyof Omit<IOrder, 'items' | 'total'>,
		value: string
	): void {
		if (field === 'payment') {
			this.order[field] = value as 'card' | 'cash';
		} else {
			this.order[field] = value;
		}

		if (field === 'email' || field === 'phone') {
			this.validateContacts();
		} else {
			this.validateOrder();
		}
	}

	validateOrder(): void {
		const errors: FormErrors = {};
		if (!this.order.payment) errors.payment = 'Выберите способ оплаты';
		if (!this.order.address.trim()) errors.address = 'Укажите адрес доставки';
		const isValid = Object.keys(errors).length === 0;
		this.errors = errors;
		this.events.emit('order:valid', { isValid, errors });
	}

	validateContacts(): void {
		const errors: FormErrors = {};
		if (!this.order.email.trim()) errors.email = 'Укажите email';
		if (!this.order.phone.trim()) errors.phone = 'Укажите телефон';
		const isValid = Object.keys(errors).length === 0;
		this.errors = errors;
		this.events.emit('contacts:valid', { isValid, errors });
	}

	async submitOrder(items: string[], total: number): Promise<void> {
		try {
			const response = await this.api.orderCards(this.getOrder(items, total));
			this.events.emit('order:success', { total: response.total });
			this.clear();
		} catch (error) {
			const errorMessage = (error as IApiError).error || 'Неизвестная ошибка';
			this.events.emit('order:error', { error: errorMessage });
		}
	}

	clear(): void {
		this.order = {
			payment: 'card',
			address: '',
			email: '',
			phone: '',
		};
		this.errors = {};

		this.events.emit('order:valid', { isValid: false, errors: {} });
		this.events.emit('contacts:valid', { isValid: false, errors: {} });
	}

	getOrder(items: string[], total: number): IOrder {
		return {
			...this.order,
			items,
			total,
		};
	}
}
