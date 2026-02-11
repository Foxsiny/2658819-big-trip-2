import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  // Метод для изменения фильтра
  setFilter(updateType, filter) {
    this.#filter = filter;
    // Уведомляем подписчиков (BoardPresenter и FilterPresenter)
    this._notify(updateType, filter);
  }
}
