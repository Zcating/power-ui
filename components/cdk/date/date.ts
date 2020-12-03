import dayjs from 'dayjs';
/**
 * get a 35 day list of current month
 *
 * @export
 * @param {Date} time
 * @returns
 */
export interface Day {
  time: Date;
  type: 'prev' | 'current' | 'next'
}

export function daysRange(this: void, time: Date): Day[] {
  const year = time.getFullYear();
  const month = time.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const firstDay = new Date(year, month, 1, 1);
  const lastAfterNum = 7 - lastDay.getDay();
  const firstBeforeNum = firstDay.getDay() - 1;
  const monthNum = lastDay.getDate() - firstDay.getDate() + 1;
  const days: Day[] = [];
  for (let i = firstBeforeNum; i > 0; i--) {
    days.push({ time: new Date(year, month, 1 - i), type: 'prev' });
  }
  for (let i = 1; i <= monthNum; i++) {
    days.push({ time: new Date(year, month, i), type: 'current' });
  }
  for (let i = 1; i <= lastAfterNum; i++) {
    days.push({ time: new Date(year, month, monthNum + i), type: 'next' });
  }
  return days;
}


export function typeMonth(this: void, type: 'prev' | 'current' | 'next', currentDate: Date): Date {
  if (type === 'prev') {
    return dayjs(currentDate).subtract(1, 'month').set('date', 1).toDate();
  } else if (type === 'current') {
    return dayjs(currentDate).toDate();
  } else if (type === 'next') {
    return dayjs(currentDate).add(1, 'month').set('date', 1).toDate();
  } else {
    throw Error('[cdk/date][typeMonth] you pass a error type parameter.');
  }
}
