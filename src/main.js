import {render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { generateFilter } from './mock/filter.js'; // Импортируем генератор данных для фильтров
import TripInfoView from './view/trip-info-view.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');

// Создаем экземпляр модели
const pointsModel = new PointsModel();

// Создаем экземпляр презентера
const boardPresenter = new BoardPresenter({
  boardContainer: siteEventsElement,
  pointsModel: pointsModel,
});

// ЗАПУСК ПРИЛОЖЕНИЯ
// Вызываем асинхронный init у модели.
pointsModel.init().finally(() => {
  const points = pointsModel.points;

  if (points.length > 0) {
    render(new TripInfoView({
      points: points,
      destinations: pointsModel.destinations,
      offers: pointsModel.offers
    }), siteHeaderElement, RenderPosition.AFTERBEGIN);
  }
  // Фильтры генерируются ТОЛЬКО после того, как данные в модели готовы
  const filters = generateFilter(pointsModel.points);
  render(new FilterView({ filters }), siteFilterElement);

  boardPresenter.init();
});
