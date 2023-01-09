export const timeTransformer = (time: number) => {
  let hour = time / 60;
  let minutes = ":30";
  let roundedHour = Math.floor(hour).toString();
  if (time % 60 == 0) {
    minutes = ":00";
  }
  let newTime = `${roundedHour}${minutes}`;
  return newTime;
};
