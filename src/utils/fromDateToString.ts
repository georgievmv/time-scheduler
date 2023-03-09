export const fromDateToString = (arg: Date) => {
  return `${new Date(arg).getFullYear()}-${
    new Date(arg).getMonth().toString().length === 1
      ? "0" + (new Date(arg).getMonth() + 1)
      : new Date(arg).getMonth() + 1
  }-${
    new Date(arg).getDate().toString().length === 1
      ? "0" + new Date(arg).getDate()
      : new Date(arg).getDate()
  }`;
};
