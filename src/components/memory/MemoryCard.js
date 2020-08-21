import React from "react";
import "./MemoryCard.css";

function MemoryCard({ isFlipped, isLocked, color, onClick }) {
  let className = "memory-card";
  if (isFlipped) {
    className = +" " + color;
  }
  return (
    <div
      className={"memory-card" + (isFlipped ? " " + color : "")}
      onClick={onClick}
    ></div>
  );
}

export default MemoryCard;
