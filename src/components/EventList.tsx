import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useContext, useState } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../assets/timeTransformer";
import useFireStore from "../hooks/useFireStore";
import { Event } from "./Pie";

const EventList: React.FC = () => {
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isIntial, setIsInitial] = useState(true);
  const firestore = useFireStore();
  const ctx = useContext(Context);

  const onClickHandler = (e: React.MouseEvent) => {
    if (!deleting) {
      setDeleting(true);
      setSelectedId(e.currentTarget.id);
    } else {
      setDeleting(false);
      setSelectedId("");
    }
  };

  const deleteEventHandler = () => {
    const newData = ctx.data.filter((elem) => elem.id !== parseInt(selectedId));

    ctx.setData(newData);
    sendData(newData);
  };

  const sendData = async (arg: Event[]) => {
    await firestore("updateDoc", { data: arg });
  };

  return (
    <>
      {ctx.data.map((elem) => {
        return (
          <Card
            id={elem.id.toString()}
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
            {deleting && selectedId === elem.id.toString() ? (
              <Button onClick={deleteEventHandler} variant="danger">
                Delete
              </Button>
            ) : (
              ""
            )}
          </Card>
        );
      })}
    </>
  );
};

export default EventList;
