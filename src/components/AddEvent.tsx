import React from "react";
import { Form, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../store/app-context";
import useFireStore from "../hooks/useFireStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { timeTransformer } from "../utils/timeTransformer";
import { dataReformer } from "../utils/reformDataForBar";
import BarHoverInfo from "./BarHoverInfo";
import { randomTimeGenerator } from "../utils/timeTransformer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DateInput from "./DateInput";
import { Event, Recurrence } from "../types/types";
import { fromDateToString } from "../utils/fromDateToString";

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
  const [recurrence, setRecurrence] = useState<Recurrence>();
  const [hover, setHover] = useState("");
  const [isInitial, setIsInitial] = useState(false);
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(810);
  const [eventTitle, setEventTitle] = useState("");
  const [IsEventAlreadyPlaned, setIsEventAlreadyPlaned] = useState(false);
  const firestore = useFireStore();
  const { date, data, setAdding, setData } = useContext(Context);
  const filteredData = data.filter((elem) => elem.date === date);
  const sliderChangeHandler = (value: any) => {
    setIsEventAlreadyPlaned(false);

    filteredData[0]?.event?.forEach((elem) => {
      if (
        (value[0] < elem.start && value[1] > elem.start) ||
        (value[0] >= elem.start && value[0] < elem.end) ||
        (value[1] < elem.end && value[1] > elem.start)
      ) {
        setIsEventAlreadyPlaned(true);
      }
    });
    setStartTime(value[0]);
    setEndTime(value[1]);
  };
  useEffect(() => {
    if (!!filteredData[0]?.event?.length) {
      const randomTime = randomTimeGenerator(filteredData[0].event);
      setStartTime(randomTime[0]);
      setEndTime(randomTime[1]);
    }
  }, [date, filteredData]);

  useEffect(() => {
    const sendData = async () => {
      await firestore("updateDoc", { data: data });
      if (!isInitial) {
        setIsInitial(true);
        return;
      } else {
        setAdding(false);
      }
    };
    sendData();
  }, [data]);

  const onCancelAdding = () => {
    setAdding(false);
  };

  const hoverHandler = (e: React.MouseEvent) => {
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = () => {
    setHover("");
  };

  const checkChangeHandler = (e: React.FormEvent) => {
    setRecurrence(e.currentTarget.id as Recurrence);
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const value = (endTime - startTime) / 60;
    const newEvent: Event = {
      id: randomId,
      title: eventTitle,
      value: value,
      color: randomColor,
      start: startTime,
      end: endTime,
      recurrence,
    };

    const getDates = (startDate: string, stopDate: string) => {
      const dateArray = [];
      let currentDate = new Date(startDate);
      while (currentDate <= new Date(stopDate)) {
        dateArray.push(fromDateToString(currentDate));
        currentDate = currentDate.addDays(1);
      }
      return dateArray;
    };

    if (recurrence) {
      const lastDate = new Date(date).addDays(parseInt(recurrence));
      const dates = getDates(date, fromDateToString(lastDate));
      const newData = dates.map((elem, i) => {
        if (!!data[i]?.event?.length) {
          const eventArrayWithAlreadyExistingEvent = [...data[i].event];
          eventArrayWithAlreadyExistingEvent.push(newEvent);
          return {
            date: elem,
            event: eventArrayWithAlreadyExistingEvent,
          };
        } else {
          return {
            date: elem,
            event: [newEvent],
          };
        }
      });
      setData(newData);
      toast.success("You've successfully added a new event", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setData((prevState) => {
        if (prevState.find((elem) => elem.date === date)) {
          let newState = [...prevState];
          const selectedDay = prevState.filter((elem) => elem.date === date);
          const indexToSplice = prevState.indexOf(selectedDay[0]);
          selectedDay[0].event.push(newEvent);
          const newDay = { date, event: selectedDay[0].event };
          newState.splice(indexToSplice, 1, newDay);
          return newState;
        }
        return [...prevState, { date, event: [newEvent] }];
      });
      toast.success("You've successfully added a new event", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <Form onSubmit={formSubmitHandler} className="home-page-container my-4">
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
      <Form.Group>
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
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
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
          dataReformer(data, date).map((elem, i, arr) => {
            return (
              <div
                className="taken-hours"
                id={elem.id}
                onClick={(e) => {
                  setHover(e.currentTarget.id);
                }}
                onMouseEnter={hoverHandler}
                onMouseOut={hoverOutHandler}
                key={elem.id}
                style={
                  i === data.length - 1
                    ? {
                        border: "none",
                        width: `${elem.percent}%`,
                        left: `${elem.startPercentage}%`,
                      }
                    : {
                        width: `${elem.percent}%`,
                        left: `${elem.startPercentage}%`,
                      }
                }
              >
                {hover === elem.id && (
                  <BarHoverInfo title={arr[i]?.title} start={arr[i]?.start} end={arr[i]?.end} />
                )}
              </div>
            );
          })}

        <Slider
          onChange={sliderChangeHandler}
          railStyle={{
            background: "#30115e",
            height: "7px",
          }}
          handleStyle={[
            {
              zIndex: "3",
              cursor: "pointer",
              border: "none",
              backgroundColor: "#ea39b8",
              opacity: "1",
              height: "16px",
              width: "16px",
            },
            {
              zIndex: "3",

              cursor: "ponter",
              border: "none",
              backgroundColor: "#ea39b8",
              opacity: "1",
              height: "16px",
              width: "16px",
            },
          ]}
          trackStyle={[{ height: "7px", backgroundColor: "transparent" }]}
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
        <p style={{ position: "absolute" }}>You have an event planed in this timespan</p>
      )}
      <div style={{ textAlign: "center" }}>
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
