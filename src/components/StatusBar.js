import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ status1, status2, onRestart, onShowLeaderboard }) {
  return (
    <div className="status-bar">
      <div className="status-container">
        <p className="status">{status1}</p>
        <p className="status">{status2}</p>
      </div>
      <Button
        className="button"
        variant="light"
        className="button"
        onClick={onRestart}
      >
        Restart
      </Button>
      <Button
        className="button"
        variant="light"
        className="button"
        onClick={onShowLeaderboard}
      >
        Leaderboard
      </Button>
    </div>
  );
}

export default StatusBar;
