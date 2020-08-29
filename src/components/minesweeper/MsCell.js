import React from "react";
import "./MsCell.css";

function MsCell({
  isOpen,
  isMarked,
  isMine,
  minesAround,
  onClick,
  onRightClick,
}) {
  return (
    //   Renders cell depending on wether isOpen property
    <div
      className={"ms-cell " + (isOpen ? "ms-cell-open" : "")}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {/*If isMarked is true and isOpen is false, following will be rendered */}
      {isMarked && !isOpen && <span className="ms-icon fas fa-flag"></span>}
      {/* If isMine is true and isOpen is false, following will be rendered */}
      {isMine && isOpen && <span className="ms-icon fas fa-bomb"></span>}
      {/* If isMine is false and isOpen is true and minesAround is bigger than 0, following will be rendered */}
      {!isMine && isOpen && minesAround > 0 && (
        <span className={`ms-icon ms-number ms-${minesAround}`}>
          {minesAround}
        </span>
      )}
    </div>
  );
}

export default MsCell;
