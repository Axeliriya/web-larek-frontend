export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiError {
	error: string;
}

export interface ICard {
	id: string;
	title: string;
	category: string;
	price: number | null;
	description: string;
	image: string;
	inBasket?: boolean;
}

export interface IBasket {
	items: ICard[];
	total: number;
}

export interface ICardsData {
	cards: ICard[];
	getCard(cardId: string): ICard;
}

export interface IOrderForm {
	total: number;
	payment: 'card' | 'cash';
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
