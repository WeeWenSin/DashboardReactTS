import { useEffect, useState } from "react";
import { fetchPopulationData } from "../Api/api";
import PopulationBarChart from "./BarChart";
import { filterPopulationData } from "../utils/filterPopulationData";
import PopulationPieChart from "./PieCharts";
import PopulationRadarChart from "./RadarChart";
import StatsCard from "./StatsCard1";
import ModeToggleBtn from "./ModeToggleBtn"; // 引入 ModeToggleCard

const PopulationChart = () => {
  const [isDarkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [apiData, setApiData] = useState<any[]>([]);
  const [year, setYear] = useState("2024-01-01");

  useEffect(() => {
    const getData = async () => {
      const data = await fetchPopulationData();
      setApiData(data);
    };
    getData();
  }, []);

  const filteredData = (filterOptions: { age?: string; sex?: string; ethnicity?: string }) =>
    filterPopulationData(apiData, { ...filterOptions, date: year });

  const ageData = filteredData({ sex: "both", ethnicity: "overall" });
  const genderData = filteredData({ age: "overall", ethnicity: "overall" });
  const ethnicityData = filteredData({ age: "overall", sex: "both" });
  const stats1 = filteredData({ age: "overall", sex: "both", ethnicity: "overall" });

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode)); // 保存模式选择
      return newMode;
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f4f4f9";
  }, [isDarkMode]);

  return (
    <div style={{ padding: "10px", color: isDarkMode?"#fff":"#333" }}>
    <h1>Malaysia Population Data</h1>
      {/* 年份选择器和模式切换放在同一行 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <label htmlFor="year" style={{ fontSize: "1.5rem" }}>Select Year: </label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ fontSize: "1.2rem", padding: "0.4rem", minWidth: "150px" }}
          >
            {Array.from(new Set(apiData.map(item => item.date)))
              .sort()
              .map((date) => {
                const yearLabel = new Date(date).getFullYear();
                return (
                  <option key={date} value={date}>
                    {yearLabel}
                  </option>
                );
              })}
          </select>
        </div>
        
        {/* 昼夜模式按钮 */}
        <ModeToggleBtn isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      <div style={{ background: isDarkMode ? "#333" : "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom:"10px" }}>
        <StatsCard title="Total Population ('000 million)" value={stats1[0]?.population || 0} darkMode={isDarkMode} />
      </div>
 
      <div style={{ 
        background: isDarkMode ? "#333" : "#fff", 
        borderRadius: "10px", 
        padding: "20px", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginBottom:"10px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }}>Age</h2>
        <PopulationBarChart data={ageData} />
      </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "10px" }}>
        <div style={{ 
          background: isDarkMode ? "#333" : "#fff", 
          borderRadius: "10px", 
          padding: "20px", 
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom:"10px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Gender</h2>
          <PopulationPieChart data={genderData} />
        </div>
        <div style={{ 
          background: isDarkMode ? "#333" : "#fff", 
          borderRadius: "10px", 
          padding: "20px", 
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom:"10px"
}}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px" }}>Ethnicity</h2>
          <PopulationRadarChart data={ethnicityData} />
        </div>
      </div>
    </div>
  );
};

export default PopulationChart;
