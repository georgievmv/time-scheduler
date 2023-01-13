import { Event } from "../components/Pie";

export const dataReformer = (data: any[]) => {
  const startAndEndPercentageArr = data.map((elem) => {
    return {
      id: elem.id,
      startPercentage: elem.start / 14.4,
      percent: elem.end / 14.4 - elem.start / 14.4,
    };
  });
  return startAndEndPercentageArr;
};
