import React from "react";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import BarHoverInfo from "./BarHoverInfo";
import { dataReformer } from "../utils/reformDataForBar";

const Bar = () => {
  const { data, date } = useContext(Context);
  const [hover, setHover] = useState("");
  const filteredData = data.filter((elem) => elem.date === date);
  const hoverHandler = (e: React.MouseEvent) => {
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = (e: React.MouseEvent) => {
    setHover("");
  };
  return (
    <div className="bar-container">
      {filteredData[0]?.event?.length > 0 &&
        dataReformer(data, date).map((elem, i, arr) => {
          return (
            <div
              id={elem.id}
              onClick={(e) => {
                setHover(e.currentTarget.id);
              }}
              onMouseEnter={hoverHandler}
              onMouseOut={hoverOutHandler}
              key={elem.id}
              className={
                elem.recurrence
                  ? "progress-bar bg-secondary bar-element"
                  : "progress-bar bg-success bar-element"
              }
              style={{
                borderRight: elem.end === arr[i + 1]?.start ? "1px solid black" : "none",
                width: `${elem.percent}%`,
                left: `${elem.startPercentage}%`,
              }}
            >
              {hover === elem.id && (
                <BarHoverInfo title={arr[i].title} start={arr[i].start} end={arr[i].end} />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Bar;
