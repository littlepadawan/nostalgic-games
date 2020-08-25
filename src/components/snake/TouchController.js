import React from "react";
import Button from "react-bootstrap/Button";
import "./TouchController.css";

function TouchController({ onChangeDir }) {
  return (
    <div className="tc-container">
      <div className="tc-grid">
        <Button
          variant="light"
          onClick={() => onChangeDir("up")}
          className="tc-button tc-up"
        >
          &#x2191;
        </Button>
        <Button
          variant="light"
          onClick={() => onChangeDir("right")}
          className="tc-button tc-right"
        >
          &#x2192;
        </Button>
        <Button
          variant="light"
          onClick={() => onChangeDir("down")}
          className="tc-button tc-down"
        >
          &#x2193;
        </Button>
        <Button
          variant="light"
          onClick={() => onChangeDir("left")}
          className="tc-button tc-left"
        >
          &#x2190;
        </Button>
      </div>
    </div>
  );
}

export default TouchController;
