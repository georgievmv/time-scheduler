import React from "react";
import { Button, Card } from "react-bootstrap";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../utils/timeTransformer";
import useFireStore from "../hooks/useFireStore";
import { EventDate } from "./Pie";
import { toast } from "react-toastify";
import WarningModal from "./WarningModal";
import { dataReformer } from "../utils/reformDataForBar";

const data = [
  {
    date: "2023-03-10",
    events: [
      { start: "zavchera", end: "po pladne", id: 1 },
      { start: "po purvi petli", end: "nikoga", id: 2 },
    ],
  },
  {
    date: "2023-03-11",
    events: [
      { start: "zavchera", end: "po pladne", id: 1 },
      { start: "po purvi petli", end: "nikoga", id: 2 },
    ],
  },
];
const EventList: React.FC = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowInstanceModal, setIsShowIntanceModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const firestore = useFireStore();
  const { date, data, setData } = useContext(Context);
  const toggleEventModalShow = () => setIsShowModal(!isShowModal);
  const toggleIntanceModalShow = () => setIsShowIntanceModal(!isShowInstanceModal);

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

  //Deleting instance

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
      {/*   <WarningModal
        title="Deleting event"
        message="Are you sure you want to delete this instance of an event?"
        show={isShowInstanceModal}
        onDecline={onDeclineDeleteInstanceHandler}
        onConfirm={onConfirmDeleteInstanceHandler}
      /> */}
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
                {/*    <Button
                  id="delete-instance"
                  className="delete-button"
                  type="button"
                  onClick={deleteInstanceHandler}
                  variant="secondary"
                >
                  Delete instance
                </Button> */}
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default EventList;
