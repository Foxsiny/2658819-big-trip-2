import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../const.js';

// Шаблон одного элемента сортировки
const createSortingItemTemplate = (sortItem, currentSortType) => {
  const {type, isDisabled} = sortItem;

  const isChecked = (type === currentSortType) ? 'checked' : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        ${isChecked}
        ${isDisabled}
      >
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
    </div>
  `;
};

// Общий шаблон формы сортировки
const createSortingTemplate = (currentSortType) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORT_TYPES.map((sortItem) => createSortingItemTemplate(sortItem, currentSortType)).join('')}
  </form>
`;

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null; // Добавляем поле для хранения текущего выбора

  // Теперь принимаем currentSortType из Презентера
  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    const sortType = evt.target.dataset.sortType;

    // Если у лейбла нет атрибута (клик по Event или Offers), ничего не делаем
    if (!sortType) {
      return;
    }

    this.#handleSortTypeChange?.(sortType);
  };
}

