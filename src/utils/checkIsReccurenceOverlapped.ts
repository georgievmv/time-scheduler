import { EventDate, Event } from '../types/types';
//faster
const checkIsReccurenceOverlappedF = (dates: string[], data: EventDate[], newEvent: Event) => {
  for (const date of dates) {
    const foundEvent = data.find((event) => event?.date === date);
    if (foundEvent) {
      for (let i = 0; i < foundEvent.event.length; i++) {
        if (foundEvent.event[i].start < newEvent.end && newEvent.start < foundEvent.event[i].end) {
          return true;
        }
      }
    }
  }
  return false;
};

//simpler
export const checkIsReccurenceOverlapped = (
  dates: string[],
  data: EventDate[],
  newEvent: Event
) => {
  return dates.some((date) => {
    const matchingDate = data.find((event) => event?.date === date);
    if (matchingDate) {
      return matchingDate.event.some(
        (elem) => elem.start < newEvent.end && newEvent.start < elem.end
      );
    }
  });
};
