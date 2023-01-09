import React from "react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/app-context";

const Bar = () => {
  const ctx = useContext(Context);
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

  return (
    <div style={{ position: "relative" }} className="bar-container">
      {reformedData.map((elem, i) => {
        return (
          <div
            key={elem.id}
            className="progress-bar bg-success bar-element"
            style={{
              height: "15px",
              position: "absolute",
              width: `${elem.percent}%`,
              left: `${elem.startPercentage}%`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default Bar;
