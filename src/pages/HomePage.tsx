import React from "react";
import Pie from "../components/Pie";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Context } from "../store/app-context";
import { Button, Row, Col, Form } from "react-bootstrap";
import useFireStore from "../hooks/useFireStore";
import { useEffect, useState, useContext } from "react";
import EventList from "../components/EventList";
import Bar from "../components/Bar";
import LoadingBar from "../components/LoadingBar";
import pieChartIcon from "../assets/pie-chart-fill.svg";

const HomePage = () => {
  const {
    setDate,
    date,
    data,
    setIsLoading,
    onlogout,
    setData,
    setAdding,
    loading,
  } = useContext(Context);
  const firestore = useFireStore();
  const [isPieChart, setIsPieChart] = useState(false);

  const getData = async () => {
    const response = await firestore("getDoc");
    setData(response.data().data);
  };
  useEffect(() => {
    if (data.length === 0) {
      setIsLoading(true);
      getData();
      setIsLoading(false);
    }
  }, []);

  const signOutHandler = async () => {
    try {
      await signOut(auth);
      onlogout();
    } catch (e) {
      alert(e);
    }
  };

  const addNewTaskButtonHandler = () => {
    setAdding(true);
  };

  const filteredData = data.filter((elem) => elem.day === date);

  return (
    <>
      {loading ? (
        <LoadingBar />
      ) : (
        <div className="home-page-container">
          <Form.Group className="mb-3">
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Form.Group>

          {isPieChart && filteredData.length !== 0 && <Pie />}
          <Bar />
          {filteredData.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              You haven`t added any events for this day yet
            </p>
          ) : (
            <div>
              <EventList />
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <Row>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button className="mt-3" onClick={signOutHandler}>
                  Log out
                </Button>
              </Col>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button
                  className="mt-3"
                  onClick={addNewTaskButtonHandler}
                  variant="secondary"
                >
                  Add new task
                </Button>
              </Col>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button
                  disabled={data.length === 0}
                  className="mt-3"
                  onClick={() => {
                    setIsPieChart((prev) => !prev);
                  }}
                >
                  <img
                    style={{ marginRight: "0.5rem" }}
                    src={pieChartIcon}
                    alt=""
                  />
                  Pie chart
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
