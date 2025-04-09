import { PieChart,Pie,ResponsiveContainer,Tooltip,Legend,Cell} from "recharts";

interface PieChartProps {
    data: { sex: string; population: number }[];
}

const COLORS = ["rgb(186, 253, 136)","rgb(193, 160, 255)"];

    const PopulationPieChart = ({ data }: PieChartProps) => {
      return (
        <ResponsiveContainer width="100%" height={420}>
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