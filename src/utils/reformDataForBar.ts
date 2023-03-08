import { Event, EventDate } from "../components/Pie";

export const dataReformer = (data: EventDate[], date: string) => {
  const filteredData = data.filter((elem) => elem.date === date);
  const minutesToPercentage = 14.4;
  /*  const selectedDay = new Date(date).getDay();
  const selectedDate = new Date(date); */
  return filteredData[0]?.event
    .map((elem) => {
      return {
        color: elem.color,
        value: elem.value,
        recurrence: elem.recurrence,
        title: elem.title,
        start: elem.start,
        end: elem.end,
        id: elem.id,
        startPercentage: elem.start / minutesToPercentage,
        percent:
          elem.end / minutesToPercentage - elem.start / minutesToPercentage,
      };
    })
    .sort((a, b) => a.start - b.start);
};
