const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
  LOADING: 'loading',
  ERROR: 'error',
};

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.LOADING]: 'Loading...',
  [FilterType.ERROR]: 'Failed to load latest route information',
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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const BLANK_POINT = {
  type: 'flight',
  destination: '',
  basePrice: 0,
  offers: [],
  dateFrom: null,
  dateTo: null,
  isFavorite: false
};

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export {POINT_TYPES, NoPointsTextType, FilterType, Mode, SortType, SORT_TYPES, UserAction, UpdateType, Method, AUTHORIZATION, END_POINT, BLANK_POINT};
