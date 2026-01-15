import {createElement} from '../render.js';
import {POINT_TYPES} from '../const.js';

// Тестовые данные для опций (в будущем они будут приходить из модели)
// const OFFERS = [
//   {id: 'luggage', title: 'Add luggage', price: 50, isChecked: true},
//   {id: 'comfort', title: 'Switch to comfort', price: 80, isChecked: true},
//   {id: 'meal', title: 'Add meal', price: 15, isChecked: false},
//   {id: 'seats', title: 'Choose seats', price: 5, isChecked: false},
//   {id: 'train', title: 'Travel by train', price: 40, isChecked: false},
// ];

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

export default class PointEditView {
  #element = null;
  #point = null;
  #destinations = null;
  #offers = null;
  constructor({point, destinations, offers}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  getTemplate() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
