import React from 'react';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import generateRandomId from '../utils/generateRandomId';
const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const numberdaysInMonth = new Date(year, month, 0).getDate();
  const emptyDaysToAddToAlignCalendar = new Date(year, month, 1).getDay() - 1;
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

  for (let i = 1; i <= numberdaysInMonth; i++) {
    days.push(i);
  }

  const monthPlusChangeHandler = () => {
    if (month === 11) {
      setYear((prevYear) => {
        setMonth(new Date(prevYear + 1, 0, 1).getMonth()); // setting month if new year
        return new Date(prevYear + 1, 0, 1).getFullYear();
      });
    } else {
      setMonth((prevMonth) => {
        return new Date(year, prevMonth + 1, 1).getMonth();
      });
    }
  };
  const monthMinusChangeHandler = () => {
    if (month === 0) {
      setYear((prevYear) => {
        setMonth(new Date(prevYear - 1, 11, 1).getMonth()); // setting month if new year
        return new Date(prevYear - 1, 11, 1).getFullYear();
      });
    } else {
      setMonth((prevMonth) => {
        return new Date(year, prevMonth - 1, 1).getMonth();
      });
    }
  };
  return (
    <div className="calendar-container">
      <h1>{monthNames[month] + ' ' + year}</h1>
      <button onClick={monthMinusChangeHandler}>left</button>
      <button onClick={monthPlusChangeHandler}>right</button>
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
        {/*   {emptySpace.map((elem) => (
          <div key={elem}></div>
        ))} */}
        {days.map((day, i) => (
          <Card
            style={typeof day !== 'number' ? { visibility: 'hidden' } : { height: '60px' }}
            border={
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
                ? 'danger'
                : 'primary'
            }
            key={day}
          >
            {day}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
