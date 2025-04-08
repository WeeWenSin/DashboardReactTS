// ../dnd_kit/Draggable.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, isDarkMode, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: isDarkMode ? "#444" : "#fff",
    marginBottom: "10px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default DraggableItem;

