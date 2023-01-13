import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { timeTransformer } from "../assets/timeTransformer";
const BarHoverInfo: React.FC<{
  title: string;
  start: number;
  end: number;
}> = (props) => {
  const [isLeft, setIsLeft] = useState(false);
  useEffect(() => {
    const elRect = document.getElementById("bar-hover-container");
    if (elRect != null && elRect.getBoundingClientRect().left < 0) {
      setIsLeft(true);
    }
  }, []);

  return (
    <Card
      style={isLeft ? { left: "0" } : {}}
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
