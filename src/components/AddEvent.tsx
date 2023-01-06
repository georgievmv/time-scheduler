import React, { ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../store/app-context";
import useFireStore from "../hooks/useFireStore";

const AddEvent = () => {
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(720);
  const [eventTitle, setEventTitle] = useState("");
  const firestore = useFireStore();
  const ctx = useContext(Context);

  const startRangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.currentTarget.value);
    setStartTime(newTime);
  };
  const endRangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.currentTarget.value);
    setEndTime(newTime);
  };

  const timeTransformer = (time: number) => {
    let hour = time / 60;
    let minutes = ":30";
    let roundedHour = Math.round(hour).toString();
    if (time % 60 == 0) {
      minutes = ":00";
    }
    let newTime = `${roundedHour}${minutes}`;
    return newTime;
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const value = (endTime - startTime) / 60;
    const newEvent = {
      title: eventTitle,
      value: value,
      color: `#${randomColor}`,
    };
    ctx.setData((prevState) => {
      return [...prevState, newEvent];
    });
  };

  useEffect(() => {
    firestore("updateDoc", { data: ctx.data });
  }, [ctx.data]);

  return (
    <div>
      <Form onSubmit={formSubmitHandler} className="my-4">
        <Form.Group className="my-3">
          <Form.Label>Event title</Form.Label>
          <Form.Control
            placeholder="Enter event title here"
            onChange={(e) => {
              setEventTitle(e.target.value);
            }}
            value={eventTitle}
            type="text"
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Control type="date"></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Starting Time:</Form.Label>
          <h5>{timeTransformer(startTime)}</h5>
          <Form.Range
            onChange={startRangeHandler}
            value={startTime}
            step={30}
            max={1440}
          ></Form.Range>
        </Form.Group>
        <Form.Group>
          <Form.Label>Ending Time</Form.Label>
          <h5>{timeTransformer(endTime)}</h5>
          <Form.Range
            onChange={endRangeHandler}
            value={endTime}
            step={30}
            max={1440}
          ></Form.Range>
        </Form.Group>
        <Button
          disabled={endTime <= startTime || !eventTitle}
          type="submit"
          variant="success"
        >
          Add
        </Button>
      </Form>
    </div>
  );
};

export default AddEvent;
