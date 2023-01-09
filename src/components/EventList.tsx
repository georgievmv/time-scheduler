import React from "react";
import { Card } from "react-bootstrap";
import { useContext } from "react";
import { Context } from "../store/app-context";
import { timeTransformer } from "../assets/timeTransformer";

const EventList: React.FC = () => {
  const ctx = useContext(Context);
  return (
    <>
      {ctx.data.map((elem) => {
        return (
          <Card key={elem.id} className="m-3" border="success">
            <Card.Header>
              <Card.Title>{elem.title}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {`from ${timeTransformer(elem.start)} to ${timeTransformer(
                  elem.end
                )}`}
              </Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default EventList;
