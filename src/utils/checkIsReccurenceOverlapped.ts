import { EventDate, Event } from '../types/types';

export const checkIsReccurenceOverlapped = (
  dates: string[],
  data: EventDate[],
  newEvent: Event
) => {
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
