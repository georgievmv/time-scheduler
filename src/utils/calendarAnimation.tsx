export const openCalendar = (date: string) => {
  document
    .querySelectorAll('.notClicked')
    ?.forEach((element) => element.classList.add('invisible'));
  document.querySelector('.daysOfTheWeek')?.classList.add('invisible');
  document.querySelector('.calendar-heading')?.classList.add('invisible');
  document.querySelectorAll('.buttons')?.forEach((element) => element.classList.add('invisible'));
  const day = new Date(date).getUTCDate().toString();
  document.getElementById(day)?.classList.remove('invisible');
  document.getElementById(day)?.classList.add('shrinkCalendar');
  setTimeout(() => {
    document.querySelector('.daysOfTheWeek')?.classList.remove('invisible');
    document.querySelector('.calendar-heading')?.classList.remove('invisible');
    document
      .querySelectorAll('.buttons')
      ?.forEach((element) => element.classList.remove('invisible'));
    document
      .querySelectorAll('.notClicked')
      ?.forEach((element) => element.classList.remove('invisible'));
  }, 700);
};

export const closeCalendar = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  document.querySelector('.shrinkCalendar')?.classList.remove('shrinkCalendar');

  document.getElementById(event.currentTarget.id)?.classList.add('expandCalendar');
  document.getElementById(event.currentTarget.id)?.classList.remove('notClicked');
  document
    .querySelectorAll('.notClicked')
    ?.forEach((element) => element.classList.add('invisible'));
  document.querySelector('.daysOfTheWeek')?.classList.add('invisible');
  document.querySelector('.calendar-heading')?.classList.add('invisible');
  document.querySelectorAll('.buttons')?.forEach((element) => element.classList.add('invisible'));
};
