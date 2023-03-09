import React from "react";
import { Button, Card } from "react-bootstrap";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../utils/timeTransformer";
import useFireStore from "../hooks/useFireStore";
import { EventDate } from "../types/types";
import { toast } from "react-toastify";
import WarningModal from "./WarningModal";
import { dataReformer } from "../utils/reformDataForBar";

const EventList: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowAllEventModal, setIsShowAllEventModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const firestore = useFireStore();
  const { date, data, setData } = useContext(Context);
  const toggleEventModalShow = () => setIsShowModal(!isShowModal);
  const toggleAllEventModalShow = () => setIsShowAllEventModal(!isShowAllEventModal);

  const onClickHandler = (e: React.MouseEvent) => {
    if (e.currentTarget.id === selectedId && deleting) {
      setDeleting(false);
    } else {
      setDeleting(true);
      setSelectedId(e.currentTarget.id);
    }
  };

  const sendData = async (arg: EventDate[]) => {
    await firestore("updateDoc", { data: arg });
  };

  //Deleting All event
  const deleteAllEventHandler = () => {
    toggleAllEventModalShow();
  };
  const onConfirmDeleteAllEventHandler = () => {
    let newData = [...data];
    newData.forEach((eventArr) => {
      eventArr.event = eventArr.event.filter((event) => event.id !== selectedId);
    });
    setData(newData);
    sendData(newData);
    toggleAllEventModalShow();
  };
  const onDeclineDeleteAllEventHandler = () => {
    toggleAllEventModalShow();
  };
  ////////

  ////Deleting Event
  const deleteEventHandler = () => {
    toggleEventModalShow();
  };
  const onConfirmDeleteEventHandler = () => {
    const filteredData = data.filter((elem) => elem.date === date);
    const newData = [...data];
    const index = newData.indexOf(filteredData[0]);
    newData[index].event = filteredData[0].event.filter((elem) => elem.id !== selectedId);
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
        show={isShowAllEventModal}
        onDecline={onDeclineDeleteAllEventHandler}
        onConfirm={onConfirmDeleteAllEventHandler}
      />
      {dataReformer(data, date)?.map((elem) => {
        return (
          <Card
            id={elem.id}
            onClick={onClickHandler}
            key={elem.id}
            style={{ cursor: "pointer" }}
            className="m-3"
            border={elem.recurrence ? "secondary" : "success"}
          >
            <Card.Body>
              <Card.Title>{elem.title}</Card.Title>
              <Card.Text>{`from ${timeTransformer(elem.start)} to ${timeTransformer(
                elem.end
              )}`}</Card.Text>
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
                {elem.recurrence && (
                  <Button
                    id="delete-instance"
                    className="delete-button"
                    type="button"
                    onClick={deleteAllEventHandler}
                    variant="secondary"
                  >
                    Delete all occurences
                  </Button>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default EventList;
