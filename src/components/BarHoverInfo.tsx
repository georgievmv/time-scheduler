import React from "react";
import { Card } from "react-bootstrap";
import { timeTransformer } from "../assets/timeTransformer";
const BarHoverInfo: React.FC<{
  title: string;
  start: number;
  end: number;
}> = (props) => {
  return (
    <Card bg="info" color="info" className="bar-hover-container">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{`from ${timeTransformer(props.start)} to ${timeTransformer(
          props.end
        )}`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BarHoverInfo;
