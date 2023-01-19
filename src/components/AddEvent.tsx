import React from "react";
import { Form, Button, FormControlProps } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { Context } from "../store/app-context";
import useFireStore from "../hooks/useFireStore";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { timeTransformer } from "../assets/timeTransformer";
import { dataReformer } from "../assets/reformDataForBar";
import BarHoverInfo from "./BarHoverInfo";

const AddEvent = () => {
  const [hover, setHover] = useState("");
  const [isInitial, setIsInitial] = useState(false);
  const [startTime, setStartTime] = useState(720);
  const [endTime, setEndTime] = useState(810);
  const [eventTitle, setEventTitle] = useState("");
  const [IsEventAlreadyPlaned, setIsEventAlreadyPlaned] = useState(false);
  const firestore = useFireStore();
  const { setDate, date, data, setAdding, setData } = useContext(Context);
  const sliderChangeHandler = (value: any) => {
    setIsEventAlreadyPlaned(false);
    data
      .filter((elem) => elem.day === date)
      .forEach((elem) => {
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
    console.log("running");
    setIsEventAlreadyPlaned(false);
    data
      .filter((elem) => elem.day === date)
      .forEach((elem) => {
        if (
          (startTime < elem.start && endTime > elem.start) ||
          (startTime >= elem.start && startTime < elem.end) ||
          (endTime < elem.end && endTime > elem.start)
        ) {
          setIsEventAlreadyPlaned(true);
        }
      });
  }, [date]);

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const value = (endTime - startTime) / 60;
    const newEvent = {
      day: date,
      id: data.length + 1,
      title: eventTitle,
      value: value,
      color: `#${randomColor}`,
      start: startTime,
      end: endTime,
    };
    setData((prevState) => {
      return [...prevState, newEvent];
    });
    console.log(newEvent);
  };

  const sendData = async () => {
    await firestore("updateDoc", { data: data });
    if (!isInitial) {
      setIsInitial(true);
      return;
    } else {
      setAdding(false);
    }
  };

  useEffect(() => {
    sendData();
  }, [data]);

  const onCancelAdding = () => {
    setAdding(false);
  };

  const hoverHandler = (e: React.MouseEvent) => {
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = (e: React.MouseEvent) => {
    setHover("");
  };

  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.currentTarget.value);
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

        <Form.Group>
          <Form.Label>Date:</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={dateChangeHandler}
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
        <div className="slider">
          {data.length > 0 &&
            dataReformer(data)
              .filter((elem) => elem.day === date)
              .map((elem, i) => {
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
                    {hover == elem.id && (
                      <BarHoverInfo
                        title={data[i]?.title}
                        start={data[i]?.start}
                        end={data[i]?.end}
                      />
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
            defaultValue={[720, 800]}
            min={0}
            max={1440}
            step={30}
          />
        </div>

        {IsEventAlreadyPlaned && (
          <p style={{ position: "absolute" }}>
            You have an event planed in this timespan
          </p>
        )}
        <div style={{ textAlign: "center" }}>
          <Button
            className="mt-5"
            disabled={
              endTime <= startTime || !eventTitle || IsEventAlreadyPlaned
            }
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
