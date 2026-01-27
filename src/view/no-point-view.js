import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType, FilterType } from '../const.js';

const createNoPointTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
};

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType = FilterType.EVERYTHING} = {}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
