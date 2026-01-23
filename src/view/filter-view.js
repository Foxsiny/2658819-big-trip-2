import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_TYPES } from '../const.js';

const createFilterItemTemplate = (type) => {
  // По умолчанию выбран фильтр "everything"
  const isChecked = (type === 'everything') ? 'checked' : '';

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
};

const createFilterTemplate = () => `
  <form class="trip-filters" action="#" method="get">
    ${FILTER_TYPES.map((type) => createFilterItemTemplate(type)).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

// 2. Наследуемся от AbstractView
export default class FilterView extends AbstractView {

  // 3. Заменяем метод getTemplate() на геттер template
  get template() {
    return createFilterTemplate();
  }
}
