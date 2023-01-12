import React, { ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../store/app-context";
import useFireStore from "../hooks/useFireStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { timeTransformer } from "../assets/timeTransformer";

const AddEvent = () => {
  const [isIntial, setIsInitial] = useState(false);
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(800);
  const [eventTitle, setEventTitle] = useState("");
  const [eventAlreadyPlaned, setEventAlreadyPlaned] = useState(false);
  const [linearGradientString, setLinearGradientString] = useState(
    "linear-gradient(to right, #30115e 0%, #30115e 100%)"
  );
  const firestore = useFireStore();
  const ctx = useContext(Context);

  const sliderChangeHandler = (value: any) => {
    setEventAlreadyPlaned(false);
    ctx.data.forEach((elem) => {
      if (
        (value[0] < elem.start && value[1] > elem.start) ||
        (startTime > elem.start && startTime < elem.end) ||
        (endTime < elem.end && endTime > elem.start)
      ) {
        setEventAlreadyPlaned(true);
      }
    });
    setStartTime(value[0]);
    setEndTime(value[1]);
  };
  useEffect(() => {
    ctx.data.forEach((elem) => {
      if (
        (startTime < elem.start && endTime > elem.start) ||
        (startTime > elem.start && startTime < elem.end) ||
        (endTime < elem.end && endTime > elem.start)
      ) {
        setEventAlreadyPlaned(true);
      }
    });
  }, []);

  //Logic for showing red color for already taken hours
  const createLinearGradient = () => {
    const percentagesArr = ctx.data
      .map((elem) => {
        return {
          startPercentage: Math.round(elem.start / 14.4),
          endPercentage: Math.round(elem.end / 14.4),
        };
      })
      .sort((a, b) => a.startPercentage - b.startPercentage);
    let newString = "linear-gradient(to right";
    if (percentagesArr) {
      percentagesArr.forEach((elem, i) => {
        if (percentagesArr.length === 1) {
          newString += `, #30115e 0%, #30115e ${elem.startPercentage}%, red ${elem.startPercentage}%, red ${elem.endPercentage}%, #30115e ${elem.endPercentage}%, #30115e 100%`;
        }
        if (i + 1 < percentagesArr.length) {
          if (elem.startPercentage !== 0) {
            newString += `, #30115e 0%, #30115e ${elem.startPercentage}%, red ${elem.startPercentage}%, red ${elem.endPercentage}%`;
          }
          newString += `, red ${elem.startPercentage}%, red ${
            elem.endPercentage
          }%, #30115e ${elem.endPercentage}%, #30115e ${
            percentagesArr[i + 1].startPercentage
          }%`;
        } else if (elem.endPercentage !== 100) {
          newString += `, red ${elem.startPercentage}%, red ${elem.endPercentage}%, #30115e ${elem.endPercentage}%, #30115e 100%`;
        }
      });
      setLinearGradientString(`${newString})`);
    }
  };

  useEffect(() => {
    createLinearGradient();
  }, []);

  ////////////////////////////////////////////////////
  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const value = (endTime - startTime) / 60;
    const newEvent = {
      id: ctx.data.length + 1,
      title: eventTitle,
      value: value,
      color: `#${randomColor}`,
      start: startTime,
      end: endTime,
    };
    ctx.setData((prevState) => {
      return [...prevState, newEvent];
    });
    console.log(newEvent);
  };

  const sendData = async () => {
    await firestore("updateDoc", { data: ctx.data });
    if (!isIntial) {
      setIsInitial(true);
      return;
    } else {
      ctx.setAdding(false);
    }
  };

  useEffect(() => {
    sendData();
  }, [ctx.data]);

  const onCancelAdding = () => {
    ctx.setAdding(false);
  };
  return (
    <div className="home-page-container">
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
        <Slider
          onChange={sliderChangeHandler}
          railStyle={{
            background: linearGradientString,
            height: "7px",
          }}
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
          trackStyle={[{ height: "7px", backgroundColor: "transparent" }]}
          range
          allowCross={false}
          defaultValue={[720, 800]}
          min={0}
          max={1440}
          step={30}
        />
        {eventAlreadyPlaned && (
          <p style={{ position: "absolute" }}>
            You have an event planed in this timespan
          </p>
        )}
        <div style={{ textAlign: "center" }}>
          <Button
            className="mt-5"
            disabled={endTime <= startTime || !eventTitle || eventAlreadyPlaned}
            type="submit"
            variant="success"
          >
            Add
          </Button>
          <Button
            className="mt-5 mx-5"
            type="button"
            onClick={onCancelAdding}
            variant="danger"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEvent;
