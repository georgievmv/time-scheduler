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

export const createDatesArray = (startDate: string, stopDate: Date, whenToRecur: string) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= stopDate) {
    switch (whenToRecur) {
      case "day":
        dateArray.push(fromDateToString(currentDate));
        currentDate = currentDate.addDays(1);
        break;
      case "workday":
        if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
          dateArray.push(fromDateToString(currentDate));
        }
        currentDate = currentDate.addDays(1);
        break;
      case "weekend":
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          dateArray.push(fromDateToString(currentDate));
        }
        currentDate = currentDate.addDays(1);
        break;
    }
  }
  return dateArray;
};
