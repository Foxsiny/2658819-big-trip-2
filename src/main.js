
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filter.js'; // Импортируем генератор данных для фильтров
import MainPresenter from './presenter/main-presenter.js';

// 1. Сначала находим все элементы в DOM
const tripMainElement = document.querySelector('.trip-main');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

// 2. Создаем экземпляр модели
const pointsModel = new PointsModel();

const filters = generateFilter(pointsModel.points);

// 3. Создаем главный презентер и передаем ему эти элементы
const mainPresenter = new MainPresenter({
  tripMainContainer: tripMainElement,
  filterContainer: filterElement,
  eventsContainer: tripEventsElement,
  pointsModel: pointsModel,
  filters: filters,
});

mainPresenter.init();

// ЗАПУСК ПРИЛОЖЕНИЯ
// Вызываем асинхронный init у модели.
pointsModel.init();
