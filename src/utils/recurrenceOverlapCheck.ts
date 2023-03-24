import { Event } from "../types/types";

export const recurrenceOvelapCheck = (prevEventArray: Event[], newEvent: Event) => {
  for (let i = 0; i < prevEventArray.length; i++) {
    if (prevEventArray[i].start < newEvent.end && newEvent.start < prevEventArray[i].end) {
      return true;
    } else {
      return false;
    }
  }
};
