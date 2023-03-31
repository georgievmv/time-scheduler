import { EventDate, Event } from "../types/types";

export const recurrenceOverlapCheck = (dates: string[], data: EventDate[], newEvent: Event) => {
  let result = false;

  for (let i in dates) {
    const foundEvent = data.find((event) => event?.date === dates[i]);
    if (foundEvent) {
      for (let i = 0; i < foundEvent.event.length; i++) {
        if (foundEvent.event[i].start < newEvent.end && newEvent.start < foundEvent.event[i].end) {
          result = true;
          break;
        }
      }
    }
  }
  return result;
};
