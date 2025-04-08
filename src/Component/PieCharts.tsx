import { PieChart,Pie,ResponsiveContainer,Tooltip,Legend,Cell} from "recharts";

interface PieChartProps {
    data: { sex: string; population: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

    const PopulationPieChart = ({ data }: PieChartProps) => {
      return (
        <ResponsiveContainer width="100%" height={400}>
           <PieChart data={data}>
                <Pie 
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="population"
                    nameKey="sex"
                    label>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
      );
    };
    
    export default PopulationPieChart;