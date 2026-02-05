import { formatDistanceToNow, format, isToday, isYesterday, differenceInMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';

const calcTimeToNow = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diffInMin = differenceInMinutes(now, d);
  if (diffInMin < 1) return 'Just now';
  if (diffInMin < 60) return `${diffInMin}m ago`;
  if (isToday(d)) return format(d, 'p'); 
  if (isYesterday(d)) return `Yesterday ${format(d, 'p')}`;
  return format(d, 'MMM d, p');
};
export default calcTimeToNow;

export const isCloseToEachOther = (currentMsgDate: string, prevMsgDate: string) => {
  if (!prevMsgDate) return false;
  return differenceInMinutes(new Date(currentMsgDate), new Date(prevMsgDate)) < 5;
};