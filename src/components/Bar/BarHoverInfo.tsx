import React, { useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import { timeTransformer } from "../../utils/timeTransformer";

const BarHoverInfo: React.FC<{
  widthOfBar?: number;
  title: string;
  start: number;
  end: number;
}> = ({ widthOfBar, title, start, end }) => {
  const [styleObject, setStyleObject] = useState<{}>({ opacity: "0" });
  const hoverInfoRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (hoverInfoRef.current != null && hoverInfoRef.current.getBoundingClientRect().left < 0) {
      setStyleObject({ left: "0" });
    } else if (
      hoverInfoRef.current != null &&
      window.innerWidth - hoverInfoRef.current.getBoundingClientRect().right < 40
    ) {
      setStyleObject({ right: "0" });
    } else if (widthOfBar && hoverInfoRef.current) {
      setStyleObject({ right: (widthOfBar - hoverInfoRef.current?.clientWidth) / 2 });
    }
  }, [widthOfBar, hoverInfoRef, setStyleObject]);

  return (
    <Card
      style={styleObject}
      ref={hoverInfoRef}
      id="bar-hover-container"
      bg="info"
      color="info"
      className="bar-hover-container"
    >
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{`from ${timeTransformer(start)} to ${timeTransformer(end)}`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BarHoverInfo;
