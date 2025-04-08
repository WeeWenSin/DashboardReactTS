import { RadarChart,Radar,PolarGrid, PolarAngleAxis, PolarRadiusAxis,ResponsiveContainer,Tooltip } from "recharts";

interface RadarChartProps {
    data: { ethnicity: string; population: number }[];
  }

const PopulationRadarChart = ({ data }: RadarChartProps) => {
    return (
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="ethnicity" />
          <PolarRadiusAxis />
          <Radar name="population" dataKey="population" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  };
export default PopulationRadarChart;