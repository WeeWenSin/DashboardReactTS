import { useEffect, useState } from "react";
import { fetchPopulationData } from "../Api/api";
import PopulationBarChart from "./BarChart";
import { filterPopulationData } from "../utils/filterPopulationData";
import PopulationPieChart from "./PieCharts";
import PopulationRadarChart from "./RadarChart";
import StatsCard from "./StatsCard1";

const cardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  marginBottom: "10px"
};

const cardTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: "10px"
};

const PopulationChart = () => {
  const [apiData, setApiData] = useState<any[]>([]);
  const [year, setYear] = useState("2024-01-01"); // Default year to filter by

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPopulationData();
      setApiData(data);
    };

    getData();
  }, []);

  const filteredData = (filterOptions: { age?: string; sex?: string; ethnicity?: string }) => 
    filterPopulationData(apiData, { ...filterOptions, date: year });

  // Filtered data for each chart
  const ageData = filteredData({ sex: "both", ethnicity: "overall" });
  const genderData = filteredData({ age: "overall", ethnicity: "overall" });
  const ethnicityData = filteredData({ age: "overall", sex: "both" });
  const stats1 = filteredData({age:"overall", sex:"both", ethnicity: "overall"});

  return (
    <>
    <div>
        <label htmlFor="year" style={{fontSize: "1.2rem"}}>Select Year:  </label>
        <select
        id="year" 
        value={year} 
        onChange={(e) => setYear(e.target.value)}
        style={{fontSize: "1.2rem", padding: "0.4rem", minWidth: "150px"}}>
        {Array.from(new Set(apiData.map(item => item.date))) // 获取所有日期
          .sort()
          .map((date) => {
            const yearLabel = new Date(date).getFullYear(); // 提取年份用于展示
            return (
              <option key={date} value={date}>
                {yearLabel}
              </option>
            );
          })}
        </select>
      </div >
      <div style={cardStyle}>
        <StatsCard title="Total Population ('000 million)" value={stats1[0]?.population || 0}/>
      </div>
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Age</h2>
          <PopulationBarChart data={ageData} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "10px" }}>
        <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Gender</h2>
          <PopulationPieChart data={genderData} />
        </div>
        <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Ethnicity</h2>
          <PopulationRadarChart data={ethnicityData} />
        </div>
      </div>
      {/* Optionally add a dropdown or input field to select the year */} 
    </>
  );
};

export default PopulationChart;
