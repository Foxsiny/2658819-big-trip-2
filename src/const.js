const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATION_NAMES = ['Chamonix', 'Geneva', 'Amsterdam', 'Paris', 'Tokyo'];

// Enum для типов фильтрации
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
  LOADING: 'loading',
};

// Enum для текстов заглушек
const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.LOADING]: 'Loading...',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const SORT_TYPES = [
  {type: SortType.DAY, isDisabled: false},
  {type: SortType.EVENT, isDisabled: true},
  {type: SortType.TIME, isDisabled: false},
  {type: SortType.PRICE, isDisabled: false},
  {type: SortType.OFFERS, isDisabled: true},
];

// Что именно сделал пользователь (действие)
const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

// На что это влияет (что надо перерисовать)
const UpdateType = {
  PATCH: 'PATCH', // Обновить только одну карточку (например, Favorite)
  MINOR: 'MINOR', // Обновить список (например, при сортировке)
  MAJOR: 'MAJOR', // Обновить всё (например, при фильтрации)
  INIT: 'INIT', // Данные успешно загружены с сервера, приложение может выходить из режима ожидания
};

export {POINT_TYPES, DESTINATION_NAMES, NoPointsTextType, FilterType, Mode, SortType, SORT_TYPES, UserAction, UpdateType};
