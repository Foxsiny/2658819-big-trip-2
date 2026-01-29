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

export {
  humanizePointDate,
  humanizePointTime,
  isPointFuture,
  isPointPast,
  isPointPresent
};
