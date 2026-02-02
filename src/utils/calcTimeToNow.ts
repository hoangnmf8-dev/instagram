import { formatDistanceToNow } from 'date-fns';

const calcTimeToNow = (pastTime: string, addSuffix = false) => {
  if(!pastTime) return;
  const pastDate = new Date(pastTime);
  const timeAgo = formatDistanceToNow(pastDate, {
    addSuffix, 
  }).replace("about", "");
  return timeAgo;
}

export default calcTimeToNow;