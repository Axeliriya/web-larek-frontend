# Проектная работа "Веб-ларек"

**Стек**: HTML, SCSS, TypeScript, Webpack

**Описание**: Веб-приложение "Веб-ларек" — это интернет-магазин, позволяющий просматривать каталог товаров, добавлять их в корзину, оформлять заказы с указанием способа оплаты и контактных данных, а также получать подтверждение заказа. Приложение построено по архитектуре MVP (Model-View-Presenter) с использованием TypeScript для строгой типизации и событийного подхода для взаимодействия компонентов.

## Структура проекта

- **src/** — исходные файлы проекта
- **src/components/** — папка с компонентами приложения
  - **src/components/base/** — базовые классы и утилиты
  - **src/components/model/** — классы моделей данных
  - **src/components/view/** — классы представления
  - **src/components/presenter/** — презентер для связи данных и представления
- **src/pages/** — HTML-файл главной страницы
  - **index.html** — главная страница приложения
- **src/types/** — файл с типами и интерфейсами
  - **index.ts** — описание всех типов данных
- **src/utils/** — утилиты и константы
  - **utils.ts** — вспомогательные функции
  - **constants.ts** — константы (API_URL, CDN_URL)
  - **CardFactory.ts** — фабрика для создания карточек товаров
  - **FormValidator.ts** — валидация форм
- **src/index.ts** — точка входа приложения
- **src/scss/** — стили приложения
  - **styles.scss** — корневой файл стилей

## Установка и запуск

Для установки и запуска проекта выполните следующие команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

## Архитектура приложения

Архитектура реализована по принципу MVP:

- **Model** — отвечает за хранение и обработку данных (карточки, корзина, заказ).
- **View** — отображает интерфейс и реагирует на действия пользователя.
- **Presenter** — управляет логикой приложения и координирует работу между Model и View через событийную систему.

Взаимодействие компонентов реализовано через брокер событий `EventEmitter`.

---

## Данные и типы данных, используемые в приложении

### Карточка товара (`ICard`)

```typescript
export interface ICard {
	id: string;
	title: string;
	category: string;
	price: number | null;
	description: string;
	image: string;
	inBasket?: boolean;
}
```

- Представляет товар в каталоге или корзине.
  - `id`: Уникальный идентификатор товара.
  - `title`: Название товара.
  - `category`: Категория товара
  - `price`: Цена товара в "синапсах" или `null` (для "бесценных" товаров).
  - `description`: Описание товара.
  - `image`: URL изображения товара.
  - `inBasket`: Флаг, указывающий, добавлен ли товар в корзину.

### Корзина (`IBasket`)

```typescript
export interface IBasket {
	items: ICard[];
	total: number;
}
```

- Хранит список товаров в корзине и их общую стоимость.
  - `items`: Массив товаров в корзине.
  - `total`: Суммарная стоимость товаров.

### Заказ (`IOrder`)

```typescript
export interface IOrderForm {
	payment: 'card' | 'cash';
	address: string;
	email: string;
	phone: string;
	total: number;
}

export interface IOrder extends IOrderForm {
	items: string[];
}
```

- Содержит данные для оформления заказа.
  - `payment`: Способ оплаты ("card" или "cash").
  - `address`: Адрес доставки.
  - `email`: Email покупателя.
  - `phone`: Телефон покупателя.
  - `total`: Общая сумма заказа.
  - `items`: Массив ID товаров в заказе.

### Ошибки формы (`FormErrors`)

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

- Хранит сообщения об ошибках валидации для полей формы заказа.

### Результат заказа (`IOrderResult`)

```typescript
export interface IOrderResult {
	id: string;
	total: number;
}
```

- Ответ сервера после успешного оформления заказа.
  - `id`: Идентификатор заказа.
  - `total`: Итоговая сумма заказа.

### Интерфейс модели данных карточек (`ICardsData`)

```typescript
export interface ICardsData {
	cards: ICard[];
	getCard(cardId: string): ICard;
}
```

- Определяет методы для работы с каталогом товаров.

### Базовые классы

#### Класс `Api`

- Отправляет HTTP-запросы к серверу.
  - `get<T>(uri: string)`: Выполняет GET-запрос и возвращает данные в формате JSON.
  - `post<T>(uri: string, data: object, method?: ApiPostMethods)`: Выполняет отправку данных на сервер.
  - `handleResponse<T>(response: Response)`: Обрабатывает ответ сервера, возвращая данные или ошибку.
- Используется в `AppApi` для взаимодействия с сервером.

#### Класс `AppApi`

- Взаимодействует с сервером через `Api`.
  - `getCards()`: Загружает каталог товаров.
  - `orderCards(order: IOrder)`: Отправляет заказ.
- Используется в `AppPresenter` и `OrderModel`.

#### Класс `EventEmitter`

- Реализует брокер событий для асинхронного взаимодействия компонентов.
  - `on<T>(eventName: EventName, callback: (data: T) => void)`: Подписка на событие.
  - `emit<T>(eventName: string, data?: T)`: Инициирует событие с данными.
  - `off(eventName: EventName, callback: Subscriber)`: Снимает обработчик события.
  - `onAll(callback: (event: EmitterEvent) => void)`: Подписка на все события.
  - `trigger<T>(eventName: string, context?: Partial<T>)`: Создаёт функцию-триггер для события.
- Связывает модели, представления и презентер.

#### Класс `Component<T>`

- Базовый класс для компонентов представления.
  - `setText(element: HTMLElement, value: unknown)`: Устанавливает текстовое содержимое.
  - `setDisabled(element: HTMLElement, state: boolean)`: Меняет состояние блокировки элемента.
  - `setImage(element: HTMLImageElement, src: string, alt?: string)`: Устанавливает изображение.
  - `render(data?: Partial<T>)`: Обновляет компонент данными и возвращает контейнер.
- Родитель для всех классов представления.

#### Класс `Model`

- Базовый класс для моделей данных.
  - `emitChanges(event: string, payload?: object)`: Инициирует событие при изменении данных.
- Родитель для `ProductCatalogModel`, `BasketModel`, `OrderModel`.

### Слой данных

#### Класс `ProductCatalogModel`

- Хранит и управляет каталогом товаров.
  - `_products: ICard[]`: Массив товаров.
  - `events: IEvents`: Брокер событий.
  - `get cards()`: Возвращает массив товаров.
  - `set cards(products: ICard[])`: Устанавливает массив товаров.
  - `getCard(cardId: string)`: Возвращает товар по ID.
- Обновляет данные через `AppPresenter` при загрузке с сервера, предоставляет товары для отображения и корзины.

#### Класс `BasketModel`

- Управляет товарами в корзине и их общей стоимостью.
  - `_items: ICard[]`: Товары в корзине.
  - `_total: number`: Сумма цен товаров.
  - `cards: ICard[]`: Ссылка на каталог товаров.
  - `events: IEvents`: Брокер событий.
  - `addItem(id: string)`: Добавляет товар в корзину, устанавливает `inBasket: true`.
  - `removeItem(id: string)`: Удаляет товар из корзины, устанавливает `inBasket: false`.
  - `clear()`: Очищает корзину.
  - `updateTotal()`: Пересчитывает сумму.
  - `get items()`: Возвращает товары в корзине.
  - `get total()`: Возвращает сумму.
  - `get itemIds()`: Возвращает массив ID товаров.
- Обновляет корзину через события `basket:changed`, синхронизирует `inBasket` с каталогом.

#### Класс `OrderModel`

- Управляет данными заказа и их валидацией.
  - `order: IOrder`: Данные заказа.
  - `errors: FormErrors`: Ошибки валидации.
  - `api: AppApi`: Клиент API.
  - `events: IEvents`: Брокер событий.
  - `setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string)`: Устанавливает значение поля заказа.
  - `validateOrder()`: Проверяет поля оплаты и адреса.
  - `validateContacts()`: Проверяет email и телефон.
  - `submitOrder(items: string[], total: number)`: Отправляет заказ на сервер.
  - `clear()`: Сбрасывает данные заказа.
  - `getOrder(items: string[], total: number)`: Возвращает данные заказа.
- Отправляет события `order:valid`, `contacts:valid`, `order:success`, `order:error` для управления формами.

### Слой представления

#### Класс `Page`

- Управляет главной страницей (галерея товаров, счётчик корзины).
  - `_counter`: Счётчик товаров в корзине.
  - `_gallery`: Контейнер для карточек.
  - `_wrapper`: Обёртка страницы.
  - `_basket`: Кнопка открытия корзины.
  - `set counter(value: number)`: Обновляет счётчик.
  - `set gallery(items: HTMLElement[])`: Отображает карточки.
  - `set locked(value: boolean)`: Блокирует/разблокирует страницу.
- Генерирует событие `basket:open`, обновляется через `AppPresenter`.

#### Класс `Modal`

- Управляет модальным окном.
  - `content`: Контейнер для содержимого.
  - `closeButton`: Кнопка закрытия.
  - `open(content: HTMLElement)`: Открывает модалку с содержимым.
  - `close()`: Закрывает модалку.
  - `handleEsc(evt: KeyboardEvent)`: Закрывает по Esc.
- Генерирует события `modal:open`, `modal:close`, `page:locked`.

#### Класс `CardView`

- Базовый класс для отображения карточек.
  - `_title`, `_category`, `_price`, `_image`: Элементы карточки.
  - `set title(value: string)`: Устанавливает название.
  - `set category(value: string)`: Устанавливает категорию с классами.
  - `set price(value: number)`: Устанавливает цену или "Бесценно".
  - `set image(src: string)`: Устанавливает изображение.
- Используется в `ProductCard` и `BasketItemView`.

#### Класс `ProductCard`

- Отображает карточку товара в каталоге или модальном окне.
  - `_cardId`: ID карточки.
  - `_description`: Описание.
  - `_button`: Кнопка "В корзину"/"Убрать".
  - `_inBasket`: Флаг нахождения в корзине.
  - `set id(value: string)`: Устанавливает ID.
  - `set inBasket(value: boolean)`: Меняет текст кнопки.
  - `set price(price: number)`: Скрывает кнопку для "бесценных" товаров.
  - `set description(text: string)`: Устанавливает описание.
  - `render(cardData: Partial<ICard>)`: Обновляет карточку.
- Генерирует события `product:select`, `basket:add`, `card:remove`.

#### Класс `Basket`

- Отображает корзину с товарами.
  - `list`: Список товаров.
  - `total`: Сумма заказа.
  - `button`: Кнопка "Оформить".
  - `render(data: Partial<IBasket>)`: Отображает товары и сумму, управляет кнопкой.
- Генерирует событие `order:open`, использует `BasketItemView`.

#### Класс `BasketItemView`

- Отображает товар в корзине.
  - Конструктор устанавливает индекс и обработчик удаления.
  - `render(data: Partial<ICard>)`: Обновляет данные.
- Генерирует событие `basket:remove`.

#### Класс `OrderForm`

- Управляет формой выбора способа оплаты и адреса.
  - `addressInput`: Поле адреса.
  - `paymentCard`, `paymentCash`: Кнопки выбора оплаты.
  - `set address(value: string)`: Устанавливает адрес.
  - `set payment(value: 'card' | 'cash')`: Выбирает способ оплаты.
- Генерирует события `order:payment`, `order:address`, `order:submit`.

#### Класс `ContactForm`

- Управляет формой ввода email и телефона.
  - `phoneInput`, `emailInput`: Поля ввода.
  - `set phone(value: string)`, `set email(value: string)`: Устанавливают значения.
- Генерирует события `contacts:email`, `contacts:phone`, `contacts:submit`.

#### Класс `SuccessView`

- Отображает подтверждение заказа.
  - `description`: Текст с суммой списания.
  - `closeButton`: Кнопка закрытия.
  - `render(data: Partial<{ total: number }>)`: Обновляет сумму.
- Генерирует событие `success:close`.

### Слой коммуникации

#### Класс `AppPresenter`

- Связывает модели и представления через события.

  - `page`, `modal`, `basket`, `orderForm`, `contactForm`, `success`: Компоненты представления.

  - `basketModel`, `orderModel`, `productCatalog`: Модели данных.

  - `fetchCards()`: Загружает товары.
  - `renderCatalog()`: Отображает каталог.
  - `setupEventListeners()`: Настраивает обработчики событий.

- Обрабатывает все события, управляет логикой приложения.

## Взаимодействие компонентов

Приложение запускается с инициализации:

```ts
const events = new EventEmitter();
const api = new AppApi(new Api(API_URL, settings));
const productCatalog = new ProductCatalogModel(events);
new AppPresenter(api, productCatalog, events);
```

Код взаимодействия находится в `AppPresenter` (`src/components/presenter/AppPresenter.ts`). Компоненты общаются через события, генерируемые брокером `EventEmitter`.

### Список событий

#### События изменения данных

- `initialData:loaded`: Данные каталога загружены.
- `basket:changed`: Корзина изменилась (добавлен/удалён товар).
- `order:valid`: Результат валидации формы оплаты/адреса.
- `contacts:valid`: Результат валидации формы контактов.
- `order:success`: Заказ успешно отправлен.
- `order:error`: Ошибка при отправке заказа.

#### События взаимодействия с интерфейсом

- `product:select`: Выбор карточки для просмотра.
- `basket:add`: Добавление товара в корзину.
- `basket:remove`: Удаление товара из корзины (из корзины).
- `card:remove`: Удаление товара из карточки (закрывает модалку).
- `basket:open`: Открытие корзины.
- `order:open`: Открытие формы заказа.
- `order:payment`: Выбор способа оплаты.
- `order:address`: Ввод адреса.
- `order:submit`: Отправка формы заказа.
- `contacts:email`, `contacts:phone`: Ввод email/телефона.
- `contacts:submit`: Отправка формы контактов.
- `success:close`: Закрытие окна успеха.
- `page:locked`: Блокировка/разблокировка страницы.
- `modal:open`, `modal:close`: Открытие/закрытие модального окна.

### Процессы в приложении

1. **Открытие карточки**:

   - Пользователь кликает на карточку в каталоге (`ProductCard`).
   - Генерируется событие `product:select`.
   - `AppPresenter` создаёт `ProductCard` с шаблоном `#card-preview` и открывает модалку.

2. **Добавление в корзину**:

   - Пользователь нажимает «В корзину» (`ProductCard`).
   - Генерируется событие `basket:add`.
   - `AppPresenter` вызывает `BasketModel.addItem`, который обновляет `inBasket` и отправляет `basket:changed`.
   - `AppPresenter` обновляет корзину, счётчик и каталог.

3. **Оформление заказа**:
   - Пользователь нажимает «Оформить» в корзине.
   - Генерируется событие `order:open`.
   - `AppPresenter` открывает `OrderForm`, затем `ContactForm`, валидирует данные и отправляет заказ.
