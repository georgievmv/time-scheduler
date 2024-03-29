import React from "react";
import { useContext } from "react";
import { Context } from "../store/app-context";
import { Form } from "react-bootstrap";

const DateInput = () => {
  const { selectedDate, setDate } = useContext(Context);
  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setDate(e.currentTarget.value);
    }
  };

  return <Form.Control type="date" value={selectedDate} onChange={dateChangeHandler} />;
};

export default DateInput;
