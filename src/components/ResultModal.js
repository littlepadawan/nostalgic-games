import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function ResultModal({
  show,
  handleClose,
  header,
  body,
  fetchLeaderboard,
  saveScore,
  scoreCanBeSaved,
}) {
  const [name, setName] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  //const [scoreCanBeSaved, setScoreCanBeSaved] = useState(scoreCanBeSaved);

  useEffect(() => {
    if (show) {
      setLeaderboard(null);
      fetchLeaderboard().then(setLeaderboard);
    }
  }, [show, scoreCanBeSaved]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{body}</p>
        {!leaderboard && <p>Loading leaderboard...</p>}
        {leaderboard && leaderboard.map((entry, i) => <p key={i}>{entry}</p>)}
        {scoreCanBeSaved && (
          <Form.Control
            type="text"
            placeholder="Enter name"
            onChange={(event) => setName(event.target.value)}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {scoreCanBeSaved && (
          <Button
            variant="secondary"
            onClick={() => {
              if (name && scoreCanBeSaved) {
                saveScore(name);
              }
            }}
          >
            Save
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            if (name && scoreCanBeSaved) {
              saveScore(name);
            }
            handleClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultModal;
