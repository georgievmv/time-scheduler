import { Event } from "../components/Pie";

export const dataReformer = (data: Event[], date: string) => {
  const selectedDate = new Date(date).getDay();
  return data
    .map((elem) => {
      return {
        recurrence: elem.recurrence,
        title: elem.title,
        start: elem.start,
        end: elem.end,
        day: elem.day,
        id: elem.id,
        startPercentage: elem.start / 14.4,
        percent: elem.end / 14.4 - elem.start / 14.4,
      };
    })
    .filter((elem) => {
      if (elem.day === date) {
        return elem;
      }
      if (elem.recurrence === "day") {
        return elem;
      } else if (elem.recurrence === "work" && selectedDate <= 4) {
        return elem;
      } else if (elem.recurrence === "weekend" && selectedDate >= 5) {
        return elem;
      }
    })
    .sort((a, b) => a.start - b.start);
};
