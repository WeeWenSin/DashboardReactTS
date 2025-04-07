import { Moon, Sun } from "lucide-react";

interface ModeToggleCardProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ModeToggleCard = ({ isDarkMode, onToggle }: ModeToggleCardProps) => {
  return (
    <button
      onClick={onToggle}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1.5rem",
        color: isDarkMode ? "#fff" : "#333",
      }}
    >
      {isDarkMode ? <Sun size={30} /> : <Moon size={30} />}
    </button>
  );
};

export default ModeToggleCard;

