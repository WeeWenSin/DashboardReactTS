import { useEffect, useState } from "react";
import { fetchPopulationData } from "./Api/api";
import PopulationBarChart from "./Component/BarChart";
import { filterPopulationData } from "./Component/filterPopulationData";
import PopulationPieChart from "./Component/PieCharts";
import PopulationRadarChart from "./Component/RadarChart";
import StatsCard from "./Component/StatsCard1";
import ModeToggleBtn from "./Component/ModeToggleBtn";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"; 

const ResponsiveGridLayout = WidthProvider(Responsive); // 创建一个响应式布局

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
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#121212" : "#f4f4f9";
  }, [isDarkMode]);

  // 所有图表内容
  const chartComponents: Record<string, JSX.Element> = {
    "age-chart": (
      <>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }}>Age Group</h2>
        <PopulationBarChart data={ageData} />
      </>
    ),
    "gender-chart": (
      <>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>Gender</h2>
        <PopulationPieChart data={genderData} />
      </>
    ),
    "ethnicity-chart": (
      <>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>Ethnicity</h2>
        <PopulationRadarChart data={ethnicityData} />
      </>
    ),
  };

  return (
      <div style={{ padding: "10px", color: isDarkMode ? "#fff" : "#333" }}>
        <h1 style={{ textAlign: "center", fontSize: "4.0rem" }}>This is example for using React Grid Layout</h1>
        <h1 style={{ textAlign: "center", fontSize: "3.0rem" }}>Malaysia Population Data</h1>

        {/* 年份选择 + 昼夜模式 */}
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
          <ModeToggleBtn isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        </div>

        {/* 人口总数 */}
        <div style={{ background: isDarkMode ? "#333" : "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "10px" }}>
          <StatsCard title="Total Population ('000 million)" value={stats1[0]?.population || 0} darkMode={isDarkMode} />
        </div>

        {/* 图表区 */}
        <ResponsiveGridLayout
        className="layout"
        layouts={{ 
          lg: [
            { i: "age-chart", x: 0, y: 0, w: 12, h: 4 }, 
            { i: "gender-chart", x: 0, y: 0, w: 6, h: 4 }, 
            { i: "ethnicity-chart", x: 0, y: 0, w: 6, h: 4 }
          ] 
          }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        margin={[20, 20]}
        containerPadding={[0, 10]}
        rowHeight={115}
        resizeHandles={['s', 'se', 'sw', 'n' , 'ne', 'nw','e','w']} // 你可以限制或者添加需要的调整大小手柄
      >
        {Object.keys(chartComponents).map(id => (
          <div key={id}>
            <div style={{
              background: isDarkMode ? "#333" : "#fff",
              border: isDarkMode ? "#666" : "none",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}>
              {chartComponents[id]}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
      </div>
  );
};

export default PopulationChart;