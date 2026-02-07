import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES} from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Вспомогательная функция для создания одного пункта списка типов
const createEventTypeItemTemplate = (type, currentType) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === currentType ? 'checked' : ''}
    >
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
      ${type.charAt(0).toUpperCase() + type.slice(1)}
    </label>
  </div>
`;

// Вспомогательная функция для генерации одной опции
const createOfferSelectorTemplate = (offer, isChecked) => {
  const {id, title, price} = offer;

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${id}-1"
        type="checkbox"
        name="event-offer-${id}"
        data-offer-id="${id}"  // <--- Добавь это для связи со стейтом
        ${isChecked ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
};

// Функция для создания ВСЕЙ секции офферов
const createOffersSectionTemplate = (offers, selectedOfferIds) => {
  if (!offers || offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => createOfferSelectorTemplate(offer, selectedOfferIds.includes(offer.id))).join('')}
      </div>
    </section>`;
};

const createPointAddTemplate = (state, destinations, offers) => {
  const {type, basePrice, destination: destinationId, offers: selectedOfferIds} = state;
  const pointDestination = destinations.find((dest) => dest.id === destinationId);
  const offersByType = offers.find((offer) => offer.type === type)?.offers || [];

  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon"/>
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"/>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${POINT_TYPES.map((pointType) => createEventTypeItemTemplate(pointType, type)).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text"
               name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1"/>
        <datalist id="destination-list-1">
          ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
               value="19/03/19 00:00"/>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
               value="19/03/19 00:00"/>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
               value="${basePrice}"/>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>

    </header>
    <section class="event__details">
      ${createOffersSectionTemplate(offersByType, selectedOfferIds)}
      ${pointDestination ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>
        </section>` : ''}
    </section>
  </form>
  </li>`;
};

export default class PointAddView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleCancelClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({destinations, offers, onFormSubmit, onCancelClick}) {
    super();

    // 1. Создаем переменную
    const blankPoint = {
      type: 'flight',
      destination: destinations[0].id,
      basePrice: 0,
      offers: [],
      dateFrom: new Date(), // Добавь дефолтные даты, чтобы flatpickr не ругался
      dateTo: new Date()
    };

    // 2. Вызываем метод и передаем в него blankPoint
    this._setState(PointAddView.parsePointToState(blankPoint));

    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointAddTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
    // noinspection DuplicatedCode
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.#setDatepicker();
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({type: evt.target.value, offers: []});
  };

  #destinationChangeHandler = (evt) => {
    const selected = this.#destinations.find((dest) => dest.name === evt.target.value);
    if (!selected) {
      return;
    }
    this.updateElement({destination: selected.id});
  };

  #offerChangeHandler = (evt) => {
    const offerId = evt.target.dataset.offerId;
    const currentOffers = [...this._state.offers];
    const index = currentOffers.indexOf(offerId);
    if (index === -1) {
      currentOffers.push(offerId);
    } else {
      currentOffers.splice(index, 1);
    }
    this._setState({offers: currentOffers});
  };

  #priceChangeHandler = (evt) => {
    this._setState({basePrice: Number(evt.target.value)});
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.(PointAddView.parseStateToPoint(this._state));
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick?.();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  // noinspection DuplicatedCode
  #setDatepicker() {
    // Календарь для даты начала
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        onChange: this.#dateFromChangeHandler, // Обработчик выбора
        'time_24hr': true,
        // noinspection DuplicatedCode
      },
    );

    // Календарь для даты окончания
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        minDate: this._state.dateFrom, // Нельзя выбрать дату ДО начала
        onChange: this.#dateToChangeHandler,
        'time_24hr': true,
      },
    );
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
