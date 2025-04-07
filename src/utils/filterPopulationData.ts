export interface FilterOptions {
    age?: string;
    sex?: string;
    ethnicity?: string;
    date?: string;
  }
  
  export const filterPopulationData = (apiData: any[], options: FilterOptions = {}) => {
    return apiData
      .filter(item =>
        (options.age ? item.age === options.age : item.age !== "overall") &&
        (options.sex ? item.sex === options.sex : item.sex !== "both") &&
        (options.ethnicity ? item.ethnicity === options.ethnicity : item.ethnicity !== "overall") &&
        (options.date ? item.date === options.date : true)  // Filter by date dynamically
      )
      .map(item => ({
        age: item.age,
        sex: item.sex,
        ethnicity: item.ethnicity,
        date: item.date,
        population: item.population
      }));
  };
  