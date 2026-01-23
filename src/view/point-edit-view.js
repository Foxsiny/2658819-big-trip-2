import AbstractView from '../framework/view/abstract-view.js';
import {POINT_TYPES} from '../const.js';


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
const createOffersSectionTemplate = (allOffers, selectedOfferIds) => {
  if (allOffers.length === 0) {
    return '';
  }

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${allOffers.map((offer) => createOfferSelectorTemplate(offer, selectedOfferIds.includes(offer.id))).join('')}
      </div>
    </section>`;
};

// 4. Основная функция шаблона
const createPointEditTemplate = (point, destinations, offers) => {
  const {type, basePrice, destination: destId, offers: selectedOfferIds} = point;

  // Находим данные текущего пункта назначения по ID
  const currentDestination = destinations.find((d) => d.id === destId);

  // Находим все доступные офферы для данного типа точки
  const offersByType = offers.find((o) => o.type === type);
  const allOffers = offersByType ? offersByType.offers : [];

  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
               name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1"/>
        <datalist id="destination-list-1">
          ${destinations.map((d) => `<option value="${d.name}"></option>`).join('')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
               value="18/03/19 12:25"/>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
               value="18/03/19 13:35"/>
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
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
     ${createOffersSectionTemplate(allOffers, selectedOfferIds)}

      ${currentDestination ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${currentDestination.description}</p>
          ${currentDestination.pictures.length > 0 ? `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${currentDestination.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
              </div>
            </div>` : ''}
        </section>` : ''}
    </section>
  </form>
  </li>
  `;
};

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;
  constructor({point, destinations, offers, onFormSubmit, onRollupClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;

    // 1. Навешиваем слушатель на отправку формы (кнопка Save)
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    // 2. Навешиваем слушатель на кнопку закрытия (стрелочка вверх)
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offers);
  }

  // Обработчик отправки формы
  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(); // Вызываем колбэк из Презентера
  };

  // Обработчик клика по стрелочке вверх
  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick(); // Вызываем колбэк из Презентера
  };
}
