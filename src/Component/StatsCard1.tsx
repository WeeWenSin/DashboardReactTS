interface StatsCardProps {
    title: string;
    value: number;
  }
  
  const StatsCard = ({ title, value }: StatsCardProps) => {
    return (
      <div style={{textAlign: "center"}}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#333" }}>{title}</h3>
        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#666" }}>
          {value.toLocaleString()}
        </p>
      </div>
    );
  };
  
  export default StatsCard;
  