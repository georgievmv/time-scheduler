import React from "react";

import { Modal, Button } from "react-bootstrap";

const WarningModal: React.FC<{
  title?: string;
  message?: string;
  show: boolean;
  onDecline: () => void;
  onConfirm: () => void;
}> = (props) => {
  const { title, message, show, onDecline, onConfirm } = props;

  return (
    <Modal onHide={onDecline} className="p-2" show={show}>
      <Modal.Title className="p-4">
        {!title ? "Modal title" : title}
      </Modal.Title>
      <Modal.Body>{!message ? "Modal message" : message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
        <Button variant="danger" onClick={onDecline}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;
