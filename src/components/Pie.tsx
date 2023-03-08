import { PieChart } from "react-minimal-pie-chart";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { dataReformer } from "../utils/reformDataForBar";

export type Event = {
  start: number;
  end: number;
  recurrence: "30" | "60" | "90" | "";
  id: string;
  color: string;
  value: number;
  title: string;
};

export type EventDate = {
  date: string;
  event: Event[];
};

const Pie = () => {
  const { date, data } = useContext(Context);
  const [isShowingPercentage, setIsShowingPercentage] = useState(false);

  const onClickHandler = () => {
    setIsShowingPercentage((prevState) => !prevState);
  };

  const valuesArr = dataReformer(data, date).map((elem) => elem.value);

  const sumOfValues = valuesArr.reduce((a, b) => a + b);
  const percentageConversionRatio = 100 / sumOfValues;
  const reformedDataForPie = dataReformer(data, date).map((elem) => {
    return { ...elem, value: elem.value * percentageConversionRatio };
  });
  return (
    <PieChart
      className="pie"
      onClick={onClickHandler}
      label={({ dataEntry }) =>
        !isShowingPercentage ? `${dataEntry.title}` : `${Math.round(dataEntry.value)}%`
      }
      animate
      animationDuration={700}
      labelStyle={{ fontSize: "8px" }}
      labelPosition={65}
      lineWidth={70}
      totalValue={100}
      data={reformedDataForPie}
    />
  );
};

export default Pie;
