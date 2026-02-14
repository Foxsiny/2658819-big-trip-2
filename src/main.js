
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel,
});

const handleNewPointFormClose = () => {
  newPointButtonElement.disabled = false;
};

const mainPresenter = new MainPresenter({
  tripMainContainer: tripMainElement,
  eventsContainer: tripEventsElement,
  pointsModel: pointsModel,
  filterModel: filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

newPointButtonElement.addEventListener('click', () => {
  mainPresenter.createPoint(); // Создаем метод-посредник
  newPointButtonElement.disabled = true; // Блокируем кнопку
});

filterPresenter.init();
mainPresenter.init();

// ЗАПУСК ПРИЛОЖЕНИЯ
// Вызываем асинхронный init у модели.
pointsModel.init().catch(() => {});
