import { Event } from "../components/Pie";

export const timeTransformer = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const formattedMinutes = minutes % 60 == 0 ? "00" : "30";
  return `${hour}:${formattedMinutes}`;
};

export const randomTimeGenerator = (arr: Event[]) => {
  const sortedArr = arr.sort((a, b) => a.start - b.start);
  if (sortedArr[0].start > 0) {
    return [0, sortedArr[0].start];
  }
  if (sortedArr[sortedArr.length - 1].end < 1440) {
    return [sortedArr[sortedArr.length - 1].end, 1440];
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].end !== arr[i + 1].start) {
      return [arr[i].end, arr[i + 1].start];
    }
  }
  return [720, 810];
};
