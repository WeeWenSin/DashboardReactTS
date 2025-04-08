import { useEffect, useState } from "react";
import { fetchPopulationData } from "../Api/api";
import PopulationBarChart from "./BarChart";
import { filterPopulationData } from "../utils/filterPopulationData";
import PopulationPieChart from "./PieCharts";
import PopulationRadarChart from "./RadarChart";
import StatsCard from "./StatsCard1";
import ModeToggleBtn from "./ModeToggleBtn";
import { DndContext,closestCenter ,DragEndEvent } from '@dnd-kit/core';
import DraggableItem from "../dnd_kit/Draggable";
import {arrayMove, SortableContext, useSortable,verticalListSortingStrategy} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable wrapper component
const SortableChartItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "1rem",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const PopulationChart = () => {
  const [isDarkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [apiData, setApiData] = useState<any[]>([]);
  const [year, setYear] = useState("2024-01-01");

  // 图表显示顺序
  const [chartOrder, setChartOrder] = useState(["age-chart", "gender-chart", "ethnicity-chart"]);

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

  // handleDragEnd：拖拽结束时被触发，判断新旧位置是否不同，若不同则更新图表显示顺序
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = chartOrder.indexOf(active.id as string);
      const newIndex = chartOrder.indexOf(over.id as string);
      setChartOrder((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ padding: "10px", color: isDarkMode ? "#fff" : "#333" }}>
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
        <div style={{ background: isDarkMode ? "#333" : "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <StatsCard title="Total Population ('000 million)" value={stats1[0]?.population || 0} darkMode={isDarkMode} />
        </div>

        {/* 图表区 */}
        <SortableContext items={chartOrder} strategy={verticalListSortingStrategy}>
          {chartOrder.map((id) => (
            <SortableChartItem key={id} id={id}>
              <div style={{
                background: isDarkMode ? "#222" : "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              }}>
                {chartComponents[id]}
              </div>
            </SortableChartItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default PopulationChart;