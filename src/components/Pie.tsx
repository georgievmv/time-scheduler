import { PieChart } from "react-minimal-pie-chart";
import { useContext } from "react";
import { Context } from "../store/app-context";

export type Event = {
  id: number;
  title: string;
  value: number;
  color: string;
  start: number;
  end: number;
};

const Pie = () => {
  const { data } = useContext(Context);
  const valuesArr = data.map((elem) => {
    return elem.value;
  });

  const sumOfValues = valuesArr.reduce((a, b) => a + b);
  const x = 100 / sumOfValues;
  const reformedData = data.map((elem) => {
    return { ...elem, value: elem.value * x };
  });
  return (
    <div className="pie">
      <PieChart
        label={({ dataEntry }) =>
          `${dataEntry.title} ${Math.round(dataEntry.value)}%`
        }
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
