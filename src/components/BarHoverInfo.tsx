import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { timeTransformer } from "../assets/timeTransformer";
const BarHoverInfo: React.FC<{
  title: string;
  start: number;
  end: number;
}> = (props) => {
  const [isLeft, setIsLeft] = useState(true);
  useEffect(() => {
    const elRect = document.getElementById("bar-hover-container");
    if (
      elRect != null &&
      window.innerWidth - elRect.getBoundingClientRect().right < 0
    ) {
      setIsLeft(false);
    }
  }, []);
  return (
    <Card
      style={isLeft ? { left: "0" } : { right: "0" }}
      id="bar-hover-container"
      bg="info"
      color="info"
      className="bar-hover-container"
    >
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
