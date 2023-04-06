import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react';
import { Context } from '../store/app-context';
import useFireStore from '../hooks/useFireStore';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { timeTransformer } from '../utils/timeTransformer';
import { dataReformer } from '../utils/reformDataForBar';
import { randomTimeGenerator } from '../utils/timeTransformer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateInput from './DateInput';
import { Event, Recurrence, EventDate } from '../types/types';
import { createDatesArray, fromDateToString } from '../utils/fromDateToString';
import BarElement from './Bar/BarElement';
import { checkIsReccurenceOverlapped } from '../utils/checkIsReccurenceOverlapped';
import WarningModal from './WarningModal';
import generateRandomId from '../utils/generateRandomId';

//Setting up addDays method to Date object
declare global {
  interface Date {
    addDays(days: number): Date;
  }
}
// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days: number) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
///////////

const AddEvent = () => {
  const [isRecurringOverlapping, setIsRecurringOverlapping] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<Recurrence>('no');
  const [whenToRecur, setWhenToRecur] = useState('day');
  const [isInitial, setIsInitial] = useState(false);
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(810);
  const [eventTitle, setEventTitle] = useState('');
  const [IsEventAlreadyPlaned, setIsEventAlreadyPlaned] = useState(false);
  const firestore = useFireStore();
  const { selectedDate, data, setAdding, setData } = useContext(Context);
  const filteredData = data.filter((elem) => elem.date === selectedDate);

  const sliderChangeHandler = (value: any) => {
    setIsEventAlreadyPlaned(false);
    //checking if slider is in position that is already taken
    filteredData[0]?.event?.forEach((elem) => {
      if (value[0] < elem.end && elem.start < value[1]) {
        setIsEventAlreadyPlaned(true);
      }
    });
    setStartTime(value[0]);
    setEndTime(value[1]);
  };

  const toggleModal = () => {
    setIsRecurringOverlapping((prevState) => !prevState);
  };

  // on date change create 'random' time for the initial position of slider thumbs
  useEffect(() => {
    if (!!filteredData[0]?.event?.length) {
      const randomTime = randomTimeGenerator(filteredData[0].event);
      setStartTime(randomTime[0]);
      setEndTime(randomTime[1]);
    }
  }, [selectedDate]);

  const onCancelAdding = () => {
    setAdding(false);
  };

  const checkChangeHandler = (e: React.FormEvent) => {
    setRecurrence(e.currentTarget.id as Recurrence);
  };

  const onRecurChangeHandler = (e: React.FormEvent) => {
    setWhenToRecur(e.currentTarget.id);
  };

  const newEvent: Event = {
    id: generateRandomId(),
    title: eventTitle,
    value: (endTime - startTime) / 60,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    start: startTime,
    end: endTime,
    recurrence,
  };

  //confirmation handler for overlapping events
  const confirmReplaceHandler = () => {
    const lastDate = new Date(selectedDate).addDays(parseInt(recurrence));
    const dates = createDatesArray(selectedDate, lastDate, whenToRecur);
    const newState = [...data];
    dates.forEach((date) => {
      const existingDate = data.find((event) => event.date === date);
      if (existingDate) {
        existingDate.event.forEach((elem, i) => {
          if (elem.start < newEvent.end && newEvent.start < elem.end) {
            existingDate.event.splice(i, 1);
          }
        });
        const index = (data as EventDate[]).indexOf(existingDate);
        newState[index].event.push(newEvent);
      } else {
        newState.push({ date, event: [newEvent] });
      }
    });
    setData(newState);
    toast.success("You've successfully added a new event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  //decline handler for overlapping events
  const declineReplaceHandler = () => {
    toggleModal();
  };

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    let dates = [selectedDate];
    //checking if task is going to repeat
    if (recurrence !== 'no') {
      const lastDate = new Date(selectedDate).addDays(parseInt(recurrence));
      dates = createDatesArray(selectedDate, lastDate, whenToRecur);
    }

    console.time('checkIsReccurenceOverlapped');
    const result1 = checkIsReccurenceOverlapped(dates, data, newEvent);
    console.timeEnd('checkIsReccurenceOverlapped');
    console.log('Result 1:', result1);

    //checking for future tasks overlapping with current one
    if (checkIsReccurenceOverlapped(dates, data, newEvent)) {
      toggleModal();
      return;
    }

    //if no task is overlapping proceed with upating the state
    let newState = [...data];
    for (let i in dates) {
      const existingDate = data.find((event) => event.date === dates[i]);
      if (existingDate) {
        const index = (data as EventDate[]).indexOf(existingDate);
        newState[index].event.push(newEvent);
      } else {
        newState.push({ date: dates[i], event: [newEvent] });
      }
    }
    setData(newState);
    toast.success("You've successfully added a new event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  //sending data ot state data state change
  useEffect(() => {
    const sendData = async () => {
      await firestore('updateDoc', { data: data });
      if (!isInitial) {
        setIsInitial(true);
        return;
      } else {
        setAdding(false);
      }
    };
    sendData();
  }, [data]);

  return (
    <Form onSubmit={formSubmitHandler} className="home-page-container my-4">
      <WarningModal
        show={isRecurringOverlapping}
        title="You have an event in the future in the same timespan"
        message="Do you want to replace the future event with this one"
        onConfirm={confirmReplaceHandler}
        onDecline={declineReplaceHandler}
      />
      <Form.Group className="my-3">
        <Form.Label>Event title</Form.Label>
        <Form.Control
          placeholder="Enter event title here"
          onChange={(e) => {
            setEventTitle(e.target.value);
          }}
          value={eventTitle}
          type="text"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Date:</Form.Label>
        <DateInput />
      </Form.Group>
      <div className="recurrence">
        <Form.Group>
          <Form.Check
            defaultChecked
            name="group"
            type="radio"
            id="no"
            onChange={checkChangeHandler}
            label="Do not repeat"
          />
          <Form.Check
            name="group"
            type="radio"
            id="30"
            onChange={checkChangeHandler}
            label="Repeat for 30 days"
          />
          <Form.Check
            name="group"
            type="radio"
            id="60"
            onChange={checkChangeHandler}
            label="Repeat for 60 days"
          />
          <Form.Check
            name="group"
            type="radio"
            id="90"
            onChange={checkChangeHandler}
            label="Repeat for 90 days"
          />
        </Form.Group>
        {recurrence !== 'no' && (
          <Form.Group>
            <Form.Check
              defaultChecked
              name="when"
              type="radio"
              id="day"
              onChange={onRecurChangeHandler}
              label="Repeat every day"
            />
            <Form.Check
              name="when"
              type="radio"
              id="weekend"
              onChange={onRecurChangeHandler}
              label="Repeat on weekends"
            />
            <Form.Check
              name="when"
              type="radio"
              id="workday"
              onChange={onRecurChangeHandler}
              label="Repeat on workdays"
            />
          </Form.Group>
        )}
      </div>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Form.Group>
          <Form.Label>Starting Time:</Form.Label>
          <h5>{timeTransformer(startTime)}</h5>
        </Form.Group>

        <Form.Group>
          <Form.Label>Ending Time:</Form.Label>
          <h5>{timeTransformer(endTime)}</h5>
        </Form.Group>
      </div>
      <div className="slider">
        {filteredData[0]?.event.length &&
          dataReformer(data, selectedDate).map((elem, i, arr) => {
            return <BarElement key={i} className="taken-hours" elem={elem} i={i} arr={arr} />;
          })}

        <Slider
          onChange={sliderChangeHandler}
          railStyle={{
            background: '#30115e',
            height: '7px',
          }}
          handleStyle={[
            {
              zIndex: '3',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#ea39b8',
              opacity: '1',
              height: '16px',
              width: '16px',
            },
            {
              zIndex: '3',

              cursor: 'ponter',
              border: 'none',
              backgroundColor: '#ea39b8',
              opacity: '1',
              height: '16px',
              width: '16px',
            },
          ]}
          trackStyle={[{ height: '7px', backgroundColor: 'transparent' }]}
          range
          allowCross={false}
          defaultValue={[startTime, endTime]}
          value={[startTime, endTime]}
          min={0}
          max={1440}
          step={30}
        />
      </div>

      {IsEventAlreadyPlaned && (
        <p style={{ position: 'absolute' }}>You have an event planed in this timespan</p>
      )}
      <div style={{ textAlign: 'center' }}>
        <Button
          className="mt-5"
          disabled={endTime <= startTime || !eventTitle || IsEventAlreadyPlaned}
          type="submit"
          variant="success"
        >
          Add
        </Button>
        <Button className="mt-5 mx-5" type="button" onClick={onCancelAdding} variant="danger">
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AddEvent;
