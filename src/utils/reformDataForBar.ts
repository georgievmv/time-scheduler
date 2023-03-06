import { Event } from "../components/Pie";

export const dataReformer = (data: Event[], date: string) => {
  const minutesToPercentage = 14.4;
  const selectedDay = new Date(date).getDay();
  const selectedDate = new Date(date);
  return data
    .map((elem) => {
      return {
        exclude: elem.exclude,
        recurrence: elem.recurrence,
        title: elem.title,
        start: elem.start,
        end: elem.end,
        day: elem.day,
        id: elem.id,
        startPercentage: elem.start / minutesToPercentage,
        percent:
          elem.end / minutesToPercentage - elem.start / minutesToPercentage,
      };
    })
    .filter((elem) => {
      const isNotInThePast = new Date(elem.day) <= selectedDate;
      const isExcluded = date !== elem.exclude;
      if (elem.day === date) {
        return elem;
      }
      if (elem.recurrence === "day" && isNotInThePast && isExcluded) {
        return elem;
      } else if (
        elem.recurrence === "work" &&
        selectedDay <= 4 &&
        isNotInThePast &&
        isExcluded
      ) {
        return elem;
      } else if (
        elem.recurrence === "weekend" &&
        selectedDay >= 5 &&
        isNotInThePast &&
        isExcluded
      ) {
        return elem;
      }
    })
    .sort((a, b) => a.start - b.start);
};
