import { IApi, ICard, IOrder, IOrderResult } from '../../types';
import { ApiListResponse } from './api';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCards(): Promise<ICard[]> {
		return this._baseApi
			.get<ApiListResponse<ICard>>(`/product`)
			.then((data: ApiListResponse<ICard>) => data.items.map((item) => item));
	}

	orderCards(order: IOrder): Promise<IOrderResult> {
		return this._baseApi
			.post<IOrderResult>(`/order`, order)
			.then((data: IOrderResult) => data);
	}
}
