interface StatsCardProps {
    title: string;
    value: number;
    darkMode: boolean;
  }
  
  const StatsCard = ({ title, value, darkMode }: StatsCardProps) => {
    return (
      <div style={{
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: darkMode ? "#bbb" : "#666" }}>
          {title}
        </h3>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: darkMode ? "#fff" : "#333" }}>
          {value.toLocaleString()}
        </p>
      </div>
    );
  };
  
  export default StatsCard;
  
  