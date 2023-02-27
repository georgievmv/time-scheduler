import React from "react";

import { Modal, Button } from "react-bootstrap";

const WarningModal: React.FC<{
  title?: string;
  message?: string;
  show: boolean;
  onDecline: () => void;
  onConfirm: () => void;
}> = (props) => {
  return (
    <Modal onHide={props.onDecline} className="p-2" show={props.show}>
      <Modal.Title className="p-4">
        {!props.title ? "Modal title" : props.title}
      </Modal.Title>
      <Modal.Body>
        {!props.message ? "Modal message" : props.message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.onConfirm}>
          Yes
        </Button>
        <Button variant="danger" onClick={props.onDecline}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;
