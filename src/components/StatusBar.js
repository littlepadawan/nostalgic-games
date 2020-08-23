import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ status, onRestart, onShowLeaderboard }) {
  return (
    <div className="status-bar">
      <p className="status">{status}</p>
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
