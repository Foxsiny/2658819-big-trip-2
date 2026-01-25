import AbstractView from '../framework/view/abstract-view.js';


const SORT_TYPES = ['day', 'event', 'time', 'price', 'offers'];

// Шаблон одного элемента сортировки
const createSortingItemTemplate = (type) => {
  // Колонки Event и Offers не поддерживают сортировку по ТЗ
  const isDisabled = (type === 'event' || type === 'offers') ? 'disabled' : '';
  // По умолчанию выбрана сортировка по дням (Day)
  const isChecked = (type === 'day') ? 'checked' : '';

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
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>
  `;
};

// Общий шаблон формы сортировки
const createSortingTemplate = () => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORT_TYPES.map((type) => createSortingItemTemplate(type)).join('')}
  </form>
`;

// Наследуемся от AbstractView
export default class SortingView extends AbstractView {
  get template() {
    return createSortingTemplate();
  }
}

