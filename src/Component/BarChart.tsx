import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: { age: string; population: number }[];
}

const PopulationBarChart = ({ data }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="population" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopulationBarChart;
