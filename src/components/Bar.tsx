import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/app-context";
import BarHoverInfo from "./BarHoverInfo";
import { dataReformer } from "../assets/reformDataForBar";

const Bar = () => {
  const { data } = useContext(Context);
  const [hover, setHover] = useState("");

  const hoverHandler = (e: React.MouseEvent) => {
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = (e: React.MouseEvent) => {
    setHover("");
  };

  return (
    <div className="bar-container">
      {data.length > 0 &&
        dataReformer(data).map((elem, i) => {
          return (
            <div
              id={elem.id}
              onClick={(e) => {
                setHover(e.currentTarget.id);
              }}
              onMouseEnter={hoverHandler}
              onMouseOut={hoverOutHandler}
              key={elem.id}
              className="progress-bar bg-success bar-element"
              style={{
                overflow: "visible",
                height: "15px",
                position: "absolute",
                width: `${elem.percent}%`,
                left: `${elem.startPercentage}%`,
              }}
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
    </div>
  );
};

export default Bar;
