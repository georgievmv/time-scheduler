export const timeTransformer = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const formattedMinutes = minutes % 60 == 0 ? "00" : "30";
  return `${hour}:${formattedMinutes}`;
};
