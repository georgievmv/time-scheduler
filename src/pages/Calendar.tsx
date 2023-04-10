import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import generateRandomId from '../utils/generateRandomId';
import { Context } from '../store/app-context';
import { fromDateToString } from '../utils/fromDateToString';
import { closeCalendar } from '../utils/calendarAnimation';
import useFireStore from '../hooks/useFireStore';

const Calendar: React.FC<{
  setIsHomeOpened: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsHomeOpened }) => {
  const { setIsCalendarOpened, setDate, selectedDate, data, setIsLoading, setData } =
    useContext(Context);
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const firestore = useFireStore();
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await firestore('getDoc');
      setData(response.data().data);
      setIsLoading(false);
    };
    if (data.length === 0) {
      getData();
    }
  }, []);

  const numberDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfTheMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const emptyDaysToAddToAlignCalendar = firstDayOfTheMonth.getDay() - 1;
  let emptySpace = [];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < emptyDaysToAddToAlignCalendar; i++) {
    emptySpace.push(generateRandomId());
  }
  let days: (string | number)[] = [...emptySpace];
  for (let i = 1; i <= numberDaysInMonth; i++) {
    days.push(i);
  }

  const monthPlusChangeHandler = () => {
    setCurrentDate((prevState) => {
      return new Date(prevState.getFullYear(), prevState.getMonth() + 1, 1);
    });
  };
  const monthMinusChangeHandler = () => {
    setCurrentDate((prevState) => {
      return new Date(prevState.getFullYear(), prevState.getMonth() - 1, 1);
    });
  };

  const calendarCloseHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    closeCalendar(event);

    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      parseInt(event.currentTarget.id)
    );
    setDate(fromDateToString(newDate));
    setIsHomeOpened(true);

    setTimeout(() => {
      document.getElementById('home-container')?.classList.add('expandHome');
      setIsCalendarOpened(false);
    }, 400);
  };

  const arrayWithDatesFromMonth = days.map((elem) => {
    return {
      id: elem,
      day: `${currentDate.getFullYear()}-${
        (currentDate.getMonth() + 1).toString().length === 1
          ? '0' + (currentDate.getMonth() + 1)
          : currentDate.getMonth()
      }-${elem.toString().length === 1 ? '0' + elem : elem}`,
    };
  });
  const datesWithEvents = arrayWithDatesFromMonth.filter((date) => {
    const existingDateInData = data.find((elem) => elem.date === date.day);
    if (existingDateInData && !!existingDateInData.event.length) {
      return date;
    }
  });

  const dayBorderColor = (i: number) => {
    const today = fromDateToString(new Date());
    if (
      i === 5 ||
      i === 6 ||
      i === 12 ||
      i == 13 ||
      i === 19 ||
      i === 20 ||
      i === 26 ||
      i == 27 ||
      i === 33 ||
      i == 34
    ) {
      return 'danger';
    } else if (today === arrayWithDatesFromMonth[i].day) {
      return 'success';
    } else {
      return 'primary';
    }
  };
  return (
    <div className="calendar-container">
      <h1 className="calendar-heading">
        {monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear()}
      </h1>
      <div className="buttons">
        <Button className="w-25" onClick={monthMinusChangeHandler}>
          Previous
        </Button>

        <Button className="w-25" onClick={monthPlusChangeHandler}>
          Next
        </Button>
      </div>
      <div className="daysOfTheWeek">
        {daysOfTheWeek.map((elem, i) => {
          return (
            <Card border={i === 5 || i === 6 ? 'danger' : 'primary'} key={elem}>
              {elem}
            </Card>
          );
        })}
      </div>
      <div className="calendar">
        {days.map((day, i) => (
          <Card
            className="notClicked m-1"
            id={day.toString()}
            onClick={calendarCloseHandler}
            style={
              typeof day !== 'number'
                ? { visibility: 'hidden' }
                : { height: '60px', paddingLeft: '3px' }
            }
            border={dayBorderColor(i)}
            key={day}
          >
            {day}
            {datesWithEvents.find((date) => date.id === day) && <p>...</p>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
