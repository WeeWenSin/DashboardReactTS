import axios from "axios";

const API_URL = "https://api.data.gov.my/data-catalogue?id=population_malaysia";

// 获取数据的函数
export const fetchPopulationData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // 确保返回的数据是数组
  } catch (error) {
    console.error("Error fetching population data:", error);
    return [];
  }
};
