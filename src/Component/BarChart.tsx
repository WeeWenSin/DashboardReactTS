import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: { age: string; population: number }[];
}

const PopulationBarChart = ({ data }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data}>
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="population" fill="rgb(241, 89, 216)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PopulationBarChart;
