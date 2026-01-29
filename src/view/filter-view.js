import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filterItem, isChecked) => {
  const {type, count} = filterItem;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${type.charAt(0).toUpperCase() + type.slice(1)}
      </label>
    </div>
  `;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

// 2. Наследуемся от AbstractView
export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  // 3. Заменяем метод getTemplate() на геттер template
  get template() {
    return createFilterTemplate(this.#filters);
  }
}
