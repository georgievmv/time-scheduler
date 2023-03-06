import React from "react";
import { Button, Card } from "react-bootstrap";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../utils/timeTransformer";
import useFireStore from "../hooks/useFireStore";
import { Event } from "./Pie";
import { toast } from "react-toastify";
import WarningModal from "./WarningModal";
import { dataReformer } from "../utils/reformDataForBar";

const EventList: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowInstanceModal, setIsShowIntanceModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const firestore = useFireStore();
  const { date, data, setData } = useContext(Context);
  const toggleEventModalShow = () => setIsShowModal(!isShowModal);
  const toggleIntanceModalShow = () =>
    setIsShowIntanceModal(!isShowInstanceModal);

  const onClickHandler = (e: React.MouseEvent) => {
    if (e.currentTarget.id === selectedId && deleting) {
      setDeleting(false);
    } else {
      setDeleting(true);
      setSelectedId(e.currentTarget.id);
    }
  };

  const sendData = async (arg: Event[]) => {
    await firestore("updateDoc", { data: arg });
  };

  //Deleting instance
  const deleteInstanceHandler = () => {
    toggleIntanceModalShow();
  };

  const onConfirmDeleteInstanceHandler = () => {
    const newData = [...data];
    const eventToBeChanged = data.find((elem) => {
      return elem.id === selectedId;
    });
    const newEvent = { ...(eventToBeChanged as Event), exclude: date };
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === selectedId) {
        newData.splice(i, 1, newEvent);
      }
    }
    setData(newData);
    sendData(newData);
  };

  const onDeclineDeleteInstanceHandler = () => {
    toggleIntanceModalShow();
  };

  ////////

  ////Deleting Event
  const deleteEventHandler = () => {
    toggleEventModalShow();
  };
  const onConfirmDeleteEventHandler = () => {
    const newData = data.filter((elem) => elem.id !== selectedId);
    setData(newData);
    sendData(newData);
    toast.warning("You've deleted an event");
    toggleEventModalShow();
  };
  ////////////////
  const onDeclineDeleteEventHandler = () => {
    toggleEventModalShow();
  };

  return (
    <>
      <WarningModal
        title="Deleting event"
        message="Are you sure you want to delete this event?"
        show={isShowModal}
        onDecline={onDeclineDeleteEventHandler}
        onConfirm={onConfirmDeleteEventHandler}
      />
      <WarningModal
        title="Deleting event"
        message="Are you sure you want to delete this instance of an event?"
        show={isShowInstanceModal}
        onDecline={onDeclineDeleteInstanceHandler}
        onConfirm={onConfirmDeleteInstanceHandler}
      />
      {dataReformer(data, date).map((elem) => {
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
              <div style={{ display: "flex" }}>
                <Button
                  id="delete-event"
                  className="delete-button"
                  type="button"
                  onClick={deleteEventHandler}
                  variant="danger"
                >
                  Delete
                </Button>
                <Button
                  id="delete-instance"
                  className="delete-button"
                  type="button"
                  onClick={deleteInstanceHandler}
                  variant="secondary"
                >
                  Delete instance
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default EventList;
