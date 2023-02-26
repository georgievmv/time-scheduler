import { Event } from "../components/Pie";
export const dataReformer = (data: Event[]) => {
  return data.map((elem) => {
    return {
      title: elem.title,
      start: elem.start,
      end: elem.end,
      day: elem.day,
      id: elem.id,
      startPercentage: elem.start / 14.4,
      percent: elem.end / 14.4 - elem.start / 14.4,
    };
  });
};
