import React from "react";
import { useContext } from "react";
import { Context } from "../../store/app-context";
import BarHoverInfo from "./BarHoverInfo";
import { dataReformer } from "../../utils/reformDataForBar";
import BarElement from "./BarElement";

const Bar = () => {
  const { data, date } = useContext(Context);
  const filteredData = data.filter((elem) => elem.date === date);
  return (
    <div className="bar-container">
      {filteredData[0]?.event?.length > 0 &&
        dataReformer(data, date).map((elem, i, arr) => {
          return (
            <BarElement
              key={i}
              className={
                elem.recurrence !== "no"
                  ? "progress-bar bg-secondary bar-element"
                  : "progress-bar bg-success bar-element"
              }
              elem={elem}
              i={i}
              arr={arr}
            />
          );
        })}
    </div>
  );
};

export default Bar;
