import {render} from './render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';

// Находим места в разметке, куда будем вставлять компоненты
const siteHeaderElement = document.querySelector('.trip-main');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');

// Создаем экземпляр презентера, передав ему контейнер для отрисовки
const boardPresenter = new BoardPresenter({
  boardContainer: siteEventsElement,
});

// Отрисовываем фильтры в шапку сайта (они не зависят от доски событий)
render(new FilterView(), siteFilterElement);

// Запускаем отрисовку доски (сортировка + список с формами и точками)
boardPresenter.init();
