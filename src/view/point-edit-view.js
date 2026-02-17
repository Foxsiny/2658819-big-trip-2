import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPES} from '../const.js';
import {humanizePointDate} from '../utils/date';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


// Шаблон типа события
const createEventTypeItemTemplate = (type, currentType, isDisabled) => `
  <div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input  visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${type === currentType ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
      ${type.charAt(0).toUpperCase() + type.slice(1)}
    </label>
  </div>
`;

// Шаблон одного оффера
const createOfferSelectorTemplate = (offer, isChecked, isDisabled) => {
  const {id, title, price} = offer;

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${id}-1"
        type="checkbox"
        name="event-offer-${id}"
        data-offer-id="${id}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}  // Если форма заблокирована — нельзя менять офферы
      >
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
};

// Функция секции офферов
const createOffersSectionTemplate = (offers, selectedOfferIds, isDisabled) => {
  if (offers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offers.map((offer) => createOfferSelectorTemplate(offer, selectedOfferIds.includes(offer.id)), isDisabled).join('')}
      </div>
    </section>`;
};

// Основная функция шаблона
const createPointEditTemplate = (state, destinations, offers) => {
  const {type,
    basePrice,
    destination: destinationId,
    offers: selectedOfferIds,
    dateFrom,
    dateTo,
    isDisabled,
    isSaving,
    isDeleting
  }
    = state;

  const pointDestination = destinations.find((dest) => dest.id === destinationId);

  const offersByType = offers.find((offer) => offer.type === type)?.offers || [];

  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${POINT_TYPES.map((pointType) => createEventTypeItemTemplate(pointType, type, isDisabled)).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input
          class="event__input  event__input--destination"
          id="event-destination-1" type="text"
          name="event-destination"
          value="${pointDestination ? pointDestination.name : ''}"
          list="destination-list-1"
          ${isDisabled ? 'disabled' : ''}
        >
        <datalist id="destination-list-1">
          ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
               value="${humanizePointDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}/>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
               value="${humanizePointDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}/>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
               value="${basePrice}" ${isDisabled ? 'disabled' : ''}/>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
     ${createOffersSectionTemplate(offersByType, selectedOfferIds, isDisabled)}

      ${pointDestination ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>
          ${pointDestination.pictures.length > 0 ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pointDestination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
              </div>
            </div>` : ''}
        </section>` : ''}
    </section>
  </form>
  </li>
  `;
};

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, destinations, offers, onFormSubmit, onRollupClick, onDeleteClick }) {
    super();

    // Вместо прямого сохранения point, создаем состояние
    this._setState(PointEditView.parsePointToState(point));

    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(
      this._state, // Передаем состояние вместо чистой точки
      this.#destinations,
      this.#offers);
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

  // Метод, который AbstractStatefulView вызывает автоматически при перерисовке
  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    // Сюда мы добавим новые обработчики выбора типа и города
    // noinspection DuplicatedCode
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    // Добавляем слушатель на контейнер с офферами
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);

    // И на поле цены
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepicker();
  }

  // Вспомогательный метод для сброса состояния (нужен при отмене редактирования)
  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [], // При смене типа сбрасываем выбранные офферы
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      destination: selectedDestination.id,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();

    // Достаем ID напрямую из data-атрибута
    const checkedOfferId = evt.target.dataset.offerId;
    // Копируем текущий массив офферов из стейта
    const currentOffers = [...this._state.offers];
    // Проверяем, есть ли уже этот оффер в списке
    const index = currentOffers.indexOf(checkedOfferId);

    if (index === -1) {
      currentOffers.push(checkedOfferId);
    } else {
      currentOffers.splice(index, 1);
    }

    // Обновляем состояние БЕЗ перерисовки всей формы
    this._setState({
      offers: currentOffers,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    // Обновляем стейт "тихо" (через _setState), чтобы форма не моргала при вводе
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  // Обработчик отправки формы
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit?.(PointEditView.parseStateToPoint(this._state));
  };

  // Обработчик клика по стрелочке вверх
  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick?.();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#datepickerTo?.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#datepickerFrom?.set('maxDate', userDate);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick?.(PointEditView.parseStateToPoint(this._state));
  };

  // noinspection DuplicatedCode
  #setDatepicker() {
    if (this._state.isDisabled) {
      return;
    }
    // Календарь для даты начала, "ОТ"
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      },
    );

    // Календарь для даты окончания, "ДО"
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  // 1. Метод для состояния сохранения
  setSaving() {
    this.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  // 2. Метод для состояния удаления
  setDeleting() {
    this.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  // 3. Метод для отмены блокировки (если произошла ошибка)
  setAborting() {
    const resetFormState = () => {
      this.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.shake(resetFormState); // Вызываем покачивание из AbstractView
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
