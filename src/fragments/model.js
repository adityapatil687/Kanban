import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function ActionModal({
  show,
  title,
  placeholder,
  inputValue,
  setInputValue,
  handleClose,
  handleSubmit,
  isCreateList,
  startDate,
  setStartDate,
  targetDate,
  setTargetDate,
  errorMessage, // New prop for error message
}) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>{placeholder}</Form.Label>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form.Group>

          {isCreateList && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Target Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={startDate} // Ensure that the target date can't be earlier than the start date
                />
              </Form.Group>
            </>
          )}

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ActionModal;
