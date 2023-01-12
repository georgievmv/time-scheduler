import React from "react";
import Pie from "../components/Pie";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Context } from "../store/app-context";
import { Button, Row, Col } from "react-bootstrap";
import useFireStore from "../hooks/useFireStore";
import { useEffect, useState, useContext } from "react";
import EventList from "../components/EventList";
import Bar from "../components/Bar";
import LoadingBar from "../components/LoadingBar";
import pieChartIcon from "../assets/pie-chart-fill.svg";

const HomePage = () => {
  const ctx = useContext(Context);
  const firestore = useFireStore();
  const [pieChart, setPieChart] = useState(false);

  const getData = async () => {
    const response = await firestore("getDoc");
    ctx.setData(response.data().data);
  };
  useEffect(() => {
    ctx.setIsLoading(true);
    getData();
    ctx.setIsLoading(false);
  }, []);

  const signOutHandler = async () => {
    try {
      await signOut(auth);
      ctx.onlogout();
    } catch (e) {
      alert(e);
    }
  };

  const addNewTaskButtonHandler = () => {
    ctx.setAdding(true);
  };

  return (
    <>
      {ctx.loading ? (
        <LoadingBar />
      ) : (
        <div className="home-page-container">
          {!pieChart ? <Bar /> : <Pie />}
          {ctx.data.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              You haven`t added any events yet
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
                  disabled={ctx.data.length === 0}
                  className="mt-3"
                  onClick={() => {
                    setPieChart((prev) => !prev);
                  }}
                >
                  <img
                    style={{ marginRight: "0.5rem" }}
                    src={pieChartIcon}
                    alt=""
                  />
                  See pie chart
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
