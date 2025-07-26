import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/base/AppApi';
import { ProductCatalogModel } from './components/model/ProductCatalogModel';
import { AppPresenter } from './components/presenter/AppPresenter';
import { API_URL, settings } from './utils/constants';
import { Api } from './components/base/api';

const events = new EventEmitter();
const baseApi = new AppApi(new Api(API_URL, settings));
const productCatalog = new ProductCatalogModel(events);
new AppPresenter(baseApi, productCatalog, events);
