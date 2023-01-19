export const timeTransformer = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const formattedMinutes = minutes % 60 == 0 ? "00" : "30";
  return `${hour}:${formattedMinutes}`;
};

export const randomTimeGenerator = (min: number, max: number) => {
  return Math.floor(Math.random() * (max / 30 - min / 30) + min / 30) * 30;
};
