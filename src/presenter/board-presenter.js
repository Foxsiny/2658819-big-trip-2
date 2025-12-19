import {render} from '../render.js';
import SortingView from '../view/sorting-view.js';
import ListView from '../view/list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointAddView from '../view/point-add-view.js';

export default class BoardPresenter {
  #listComponent = new ListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortingView(), this.boardContainer);
    render(this.#listComponent, this.boardContainer);

    // Добавляем форму создания (например, второй в списке или первой)
    render(new PointAddView(), this.#listComponent.getElement());

    // Форма редактирования ПЕРВОЙ (или после формы создания)
    render(new PointEditView(), this.#listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.#listComponent.getElement());
    }
  }
}
