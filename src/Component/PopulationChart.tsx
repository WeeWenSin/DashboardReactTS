import { useEffect, useState } from "react";
import { fetchPopulationData } from "../Api/api";
import PopulationBarChart from "./BarChart";
import { filterPopulationData } from "../utils/filterPopulationData";
import PopulationPieChart from "./PieCharts";
import PopulationRadarChart from "./RadarChart";
import StatsCard from "./StatsCard1";
import ModeToggleBtn from "./ModeToggleBtn";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableItem from "../dnd_kit/Draggable";
import {arrayMove, SortableContext, useSortable,verticalListSortingStrategy} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

    // 用于处理拖拽结束后的逻辑
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over) {
        // 在此处可以实现拖拽结束时的逻辑，例如交换图表的位置
        console.log(`Item ${active.id} dropped over ${over.id}`);
      }
    };

  return (
    <DndContext onDragEnd={handleDragEnd}>
    <div style={{ padding: "10px", color: isDarkMode?"#fff":"#333"}}>

      {/*大标题 */}
    <h1 style={{textAlign:"center",fontSize:"3.0rem"}}>Malaysia Population Data</h1>

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

      {/*Statscard container*/}
      <div style={{ background: isDarkMode ? "#333" : "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom:"10px" }}>
        <StatsCard title="Total Population ('000 million)" value={stats1[0]?.population || 0} darkMode={isDarkMode} />
      </div>
      
      {/*Barchart container*/}
      <DraggableItem id="age-chart" isDarkMode={isDarkMode}>  {/* Passing isDarkMode */}
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "15px" }}>Age Group</h2>
          <PopulationBarChart data={ageData} />
        </DraggableItem>
        
        {/*Piechart & RadarChart container*/}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "10px" }}>
          <DraggableItem id="gender-chart" isDarkMode={isDarkMode} >  {/* Passing isDarkMode */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>Gender</h2>
            <PopulationPieChart data={genderData} />
          </DraggableItem>

          <DraggableItem id="ethnicity-chart" isDarkMode={isDarkMode}>  {/* Passing isDarkMode */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>Ethnicity</h2>
            <PopulationRadarChart data={ethnicityData} />
          </DraggableItem>
      </div>
    </div>
    </DndContext>
  );
};

export default PopulationChart;
