import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/app-context";
import BarHoverInfo from "./BarHoverInfo";

const Bar = () => {
  const ctx = useContext(Context);
  const [hover, setHover] = useState("");
  const [reformedData, setReformedData] = useState<any[]>([]);
  useEffect(() => {
    ctx.createLinearGradient();
  }, [ctx.data]);

  useEffect(() => {
    if (ctx.data.length > 0) {
      const startAndEndPercentageArr = ctx.data.map((elem) => {
        return {
          id: elem.id,
          startPercentage: elem.start / 14.4,
          percent: elem.end / 14.4 - elem.start / 14.4,
        };
      });

      setReformedData(startAndEndPercentageArr);
    }
  }, [ctx.data]);

  const hoverHandler = (e: React.MouseEvent) => {
    setHover(e.currentTarget.id);
  };
  const hoverOutHandler = (e: React.MouseEvent) => {
    setHover("");
  };

  return (
    <div style={{ position: "relative" }} className="bar-container">
      {ctx.data.length > 0
        ? reformedData.map((elem, i) => {
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
                {hover == elem.id ? (
                  <BarHoverInfo
                    title={ctx.data[i]?.title}
                    start={ctx.data[i]?.start}
                    end={ctx.data[i]?.end}
                  />
                ) : (
                  ""
                )}
              </div>
            );
          })
        : ""}
    </div>
  );
};

export default Bar;
