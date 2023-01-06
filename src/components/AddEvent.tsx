import React, { ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../store/app-context";
import useFireStore from "../hooks/useFireStore";
import Slider from "rc-slider";
import Range from "rc-slider";
import "rc-slider/assets/index.css";

const AddEvent = () => {
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(800);
  const [eventTitle, setEventTitle] = useState("");
  const firestore = useFireStore();
  const ctx = useContext(Context);

  const sliderChangeHandler = (value: any) => {
    setStartTime(value[0]);
    setEndTime(value[1]);
  };

  const timeTransformer = (time: number) => {
    let hour = time / 60;
    let minutes = ":30";
    let roundedHour = Math.floor(hour).toString();
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
            <Form.Label>Ending Time</Form.Label>
            <h5>{timeTransformer(endTime)}</h5>
          </Form.Group>
        </div>
        <Slider
          onChange={sliderChangeHandler}
          railStyle={{ backgroundColor: "#30115e", height: "7px" }}
          handleStyle={[
            {
              cursor: "pointer",
              border: "none",
              backgroundColor: "#ea39b8",
              opacity: "1",
              height: "16px",
              width: "16px",
            },
            {
              cursor: "ponter",
              border: "none",
              backgroundColor: "#ea39b8",
              opacity: "1",
              height: "16px",
              width: "16px",
            },
          ]}
          trackStyle={[
            { backgroundColor: "#30115e" },
            { backgroundColor: "#30115e" },
          ]}
          range
          allowCross={false}
          defaultValue={[720, 800]}
          min={0}
          max={1440}
          step={30}
        />
        <div style={{ textAlign: "center" }}>
          <Button
            className="mt-4"
            disabled={endTime <= startTime || !eventTitle}
            type="submit"
            variant="success"
          >
            Add
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEvent;
