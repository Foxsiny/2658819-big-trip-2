import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDate } from '../utils/date.js';

const createTripInfoTemplate = (points, destinations, totalCost) => {

  // 1. Формируем строку маршрута (Город 1 — Город 2 — Город 3)
  const routeNames = points.map((p) => destinations.find((d) => d.id === p.destination)?.name);
  const route = routeNames.length <= 3
    ? routeNames.join(' &mdash; ')
    : `${routeNames[0]} &mdash; ... &mdash; ${routeNames[routeNames.length - 1]}`;

  // 2. Даты
  const startDate = humanizePointDate(points[0].dateFrom);
  const endDate = humanizePointDate(points[points.length - 1].dateTo);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`

  );
};

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #totalCost = null; // Новое поле

  constructor({points, destinations, totalCost}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#totalCost);
  }
}
