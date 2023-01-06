import { PieChart } from "react-minimal-pie-chart";
import { useContext } from "react";
import { Context } from "../store/app-context";

export type Event = {
  title: string;
  value: number;
  color: string;
};

const Pie = () => {
  const { data } = useContext(Context);

  return (
    <>
      <PieChart
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{ fontSize: "8px" }}
        labelPosition={75}
        lineWidth={50}
        totalValue={24}
        data={data}
      />
    </>
  );
};

export default Pie;
