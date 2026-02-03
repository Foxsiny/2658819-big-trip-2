import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
const humanizePointTime = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';


const isPointFuture = (date) => date && dayjs().isBefore(date, 'D');
const isPointPast = (date) => date && dayjs().isAfter(date, 'D');
const isPointPresent = (dateFrom, dateTo) => {
  const now = dayjs();
  return (dayjs(dateFrom).isSame(now, 'D') || dayjs(dateFrom).isBefore(now, 'D')) &&
    (dayjs(dateTo).isSame(now, 'D') || dayjs(dateTo).isAfter(now, 'D'));
};

// Сортировка по дате (от ранних к поздним)
const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

// Сортировка по времени (от долгого к короткому)
const sortPointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};

// Сортировка по цене (от дорогого к дешевому)
const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {
  humanizePointDate,
  humanizePointTime,
  isPointFuture,
  isPointPast,
  isPointPresent,
  sortPointDay,
  sortPointTime,
  sortPointPrice
};
