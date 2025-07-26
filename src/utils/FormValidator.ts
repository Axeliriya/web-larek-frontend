import { IOrder, FormErrors } from '../types';

export class FormValidator {
	static validateOrderPayment(order: Partial<IOrder>): FormErrors {
		const errors: FormErrors = {};
		if (!order.payment || !['card', 'cash'].includes(order.payment))
			errors.payment = 'Выберите способ оплаты';
		if (!order.address) errors.address = 'Укажите адрес доставки';
		return errors;
	}

	static validateOrderContacts(order: Partial<IOrder>): FormErrors {
		const errors: FormErrors = {};
		if (!order.email) errors.email = 'Укажите email';
		if (!order.phone) errors.phone = 'Укажите телефон';
		return errors;
	}
}
