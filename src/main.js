import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {AUTHORIZATION, END_POINT} from './const.js';
import PointsApiService from './points-api-service.js';

const tripMainElement = document.querySelector('.trip-main');
const filterElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

newPointButtonElement.disabled = true;

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  pointsApiService: pointsApiService
});

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
  mainPresenter.createPoint();
  newPointButtonElement.disabled = true;
});

filterPresenter.init();
mainPresenter.init();

// ЗАПУСК ПРИЛОЖЕНИЯ
pointsModel.init()
  .finally(() => {
    newPointButtonElement.disabled = false;
  })
  .catch(() => {
    newPointButtonElement.disabled = true;
  });
