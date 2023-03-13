import React from "react";
import { useState, useRef } from "react";
import { ReformedEvent } from "../../types/types";
import BarHoverInfo from "./BarHoverInfo";

const BarElement: React.FC<{
  className: string;
  elem: ReformedEvent;
  i: number;
  arr: ReformedEvent[];
}> = ({ elem, i, arr, className }) => {
  const [widthOfBar, setWidthOfBar] = useState<number>();
  const [hover, setHover] = useState("");
  const barElementRef = useRef<HTMLDivElement | null>(null);
  const hoverHandler = (e: React.MouseEvent) => {
    setWidthOfBar(barElementRef?.current?.clientWidth);
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = (e: React.MouseEvent) => {
    setHover("");
  };
  return (
    <div
      ref={barElementRef}
      id={elem.id}
      onClick={(e) => {
        setHover(e.currentTarget.id);
      }}
      onMouseEnter={hoverHandler}
      onMouseOut={hoverOutHandler}
      key={elem.id}
      className={className}
      style={{
        borderRight: elem.end === arr[i + 1]?.start ? "1px solid black" : "none",
        width: `${elem.percent}%`,
        left: `${elem.startPercentage}%`,
      }}
    >
      {hover === elem.id && (
        <BarHoverInfo
          widthOfBar={widthOfBar}
          title={arr[i].title}
          start={arr[i].start}
          end={arr[i].end}
        />
      )}
    </div>
  );
};

export default BarElement;
