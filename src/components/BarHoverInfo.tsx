import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { timeTransformer } from "../utils/timeTransformer";

const BarHoverInfo: React.FC<{
  title: string;
  start: number;
  end: number;
}> = (props) => {
  const [isLeft, setIsLeft] = useState(false);
  const hoverInfoRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (
      hoverInfoRef.current != null &&
      hoverInfoRef.current.getBoundingClientRect().left < 0
    ) {
      setIsLeft(true);
    }
  }, []);

  return (
    <Card
      ref={hoverInfoRef}
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
