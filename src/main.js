import {render} from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';

// // 1. Находим контейнеры (Находим места в разметке, куда будем вставлять компоненты)
const siteHeaderElement = document.querySelector('.trip-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');

// 2. Создаем экземпляр модели
const pointsModel = new PointsModel();

// 3. Создаем экземпляр презентера
const boardPresenter = new BoardPresenter({
  boardContainer: siteEventsElement,
  pointsModel: pointsModel,
});

// 4. Отрисовываем фильтры (они статичны и не ждут данных)
render(new FilterView(), siteFilterElement);

// 5. ЗАПУСК ПРИЛОЖЕНИЯ
// Вызываем асинхронный init у модели.
// Когда данные (моки) будут готовы, запускаем презентер.
pointsModel.init().finally(() => {
  boardPresenter.init();
});
