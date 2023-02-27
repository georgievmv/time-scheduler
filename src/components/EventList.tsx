import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../utils/timeTransformer";
import useFireStore from "../hooks/useFireStore";
import { Event } from "./Pie";
import { toast } from "react-toastify";
import WarningModal from "./WarningModal";

const EventList: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const firestore = useFireStore();
  const { date, data, setData } = useContext(Context);
  const toggleModalShow = () => setIsShowModal(!isShowModal);
  const onClickHandler = (e: React.MouseEvent) => {
    if (e.currentTarget.id === selectedId && deleting) {
      setDeleting(false);
    } else {
      setDeleting(true);
      setSelectedId(e.currentTarget.id);
    }
  };

  const deleteEventHandler = () => {
    toggleModalShow();
  };

  const sendData = async (arg: Event[]) => {
    await firestore("updateDoc", { data: arg });
  };

  const onConfirmHandler = () => {
    const newData = data.filter((elem) => elem.id !== selectedId);
    setData(newData);
    sendData(newData);
    toast.warning("You've deleted an event");
    toggleModalShow();
  };
  const onDeclineHandler = () => {
    toggleModalShow();
  };

  return (
    <>
      <WarningModal
        title="Deleting event"
        message="Are you sure you want to delete this event?"
        show={isShowModal}
        onDecline={onDeclineHandler}
        onConfirm={onConfirmHandler}
      />
      {data
        .filter((elem) => elem.day === date)
        .sort((a, b) => a.start - b.start)
        .map((elem) => {
          return (
            <Card
              id={elem.id}
              onClick={onClickHandler}
              key={elem.id}
              style={{ cursor: "pointer" }}
              className="m-3"
              border="success"
            >
              <Card.Body>
                <Card.Title>{elem.title}</Card.Title>
                <Card.Text>
                  {`from ${timeTransformer(elem.start)} to ${timeTransformer(
                    elem.end
                  )}`}
                </Card.Text>
              </Card.Body>
              {deleting && selectedId === elem.id.toString() && (
                <Button
                  type="button"
                  onClick={deleteEventHandler}
                  variant="danger"
                >
                  Delete
                </Button>
              )}
            </Card>
          );
        })}
    </>
  );
};

export default EventList;
