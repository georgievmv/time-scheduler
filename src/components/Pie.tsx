import { PieChart } from "react-minimal-pie-chart";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";

export type Event = {
  day: string;
  id: number;
  title: string;
  value: number;
  color: string;
  start: number;
  end: number;
};

const Pie = () => {
  const { date, data } = useContext(Context);
  const [isShowingPercentage, setIsShowingPercentage] = useState(false);

  const onClickHandler = () => {
    setIsShowingPercentage((prevState) => !prevState);
  };

  const valuesArr = data
    .filter((elem) => elem.day === date)
    .map((elem) => {
      return elem.value;
    });

  const sumOfValues = valuesArr.reduce((a, b) => a + b);
  const x = 100 / sumOfValues;
  const reformedData = data
    .filter((elem) => elem.day === date)
    .map((elem) => {
      return { ...elem, value: elem.value * x };
    });
  return (
    <div className="pie">
      <PieChart
        onClick={onClickHandler}
        label={({ dataEntry }) =>
          !isShowingPercentage
            ? `${dataEntry.title}`
            : `${Math.round(dataEntry.value)}%`
        }
        animate={true}
        animationDuration={700}
        labelStyle={{ fontSize: "8px" }}
        labelPosition={65}
        lineWidth={70}
        totalValue={100}
        data={reformedData}
      />
    </div>
  );
};

export default Pie;
