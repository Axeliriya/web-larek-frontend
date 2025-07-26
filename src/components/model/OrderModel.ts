import { IOrder, IApiError, FormErrors } from '../../types';
import { IEvents } from '../base/events';
import { AppApi } from '../base/AppApi';

export class OrderModel {
	private order: IOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
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

	setItems(items: string[]): void {
		this.order.items = items;
	}

	setTotal(total: number): void {
		this.order.total = total;
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

	async submitOrder(): Promise<void> {
		try {
			const response = await this.api.orderCards(this.order);
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
			items: [],
			total: 0,
		};
		this.errors = {};
		this.events.emit('order:valid', { isValid: false, errors: {} });
		this.events.emit('contacts:valid', { isValid: false, errors: {} });
	}

	getOrder(): IOrder {
		return this.order;
	}
}
