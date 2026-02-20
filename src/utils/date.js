import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

const humanizePointDate = (date, format = DATE_FORMAT) =>
  date ? dayjs(date).format(format) : '';
const humanizePointTime = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';

const getPointDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const diff = end.diff(start); // Разница в миллисекундах
  const pointDuration = dayjs.duration(diff);

  if (pointDuration.asDays() >= 1) {
    const days = Math.floor(pointDuration.asDays());
    return `${days.toString().padStart(2, '0')}D ${pointDuration.format('HH[H] mm[M]')}`;
  } else if (pointDuration.asHours() >= 1) {
    return pointDuration.format('HH[H] mm[M]');
  } else {
    return pointDuration.format('mm[M]');
  }
};

const isPointFuture = (date) => date && dayjs().isBefore(date, 'D');
const isPointPast = (date) => date && dayjs().isAfter(date, 'D');
const isPointPresent = (dateFrom, dateTo) => {
  const now = dayjs();
  return (dayjs(dateFrom).isSame(now, 'D') || dayjs(dateFrom).isBefore(now, 'D')) &&
    (dayjs(dateTo).isSame(now, 'D') || dayjs(dateTo).isAfter(now, 'D'));
};

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
};

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {
  humanizePointDate,
  humanizePointTime,
  isPointFuture,
  isPointPast,
  isPointPresent,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
  getPointDuration
};
