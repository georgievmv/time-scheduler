import Pie from "../components/Pie";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Context } from "../store/app-context";
import { Button, Row, Col, Form } from "react-bootstrap";
import useFireStore from "../hooks/useFireStore";
import { useEffect, useState, useContext } from "react";
import EventList from "../components/EventList";
import Bar from "../components/Bar/Bar";
import LoadingBar from "../components/LoadingBar";
import pieChartIcon from "../assets/pie-chart-fill.svg";
import { toast } from "react-toastify";
import DateInput from "../components/DateInput";

const HomePage = () => {
  const { selectedDate, data, setIsLoading, onLogout, setData, setAdding, loading } =
    useContext(Context);
  const firestore = useFireStore();
  const [isPieChart, setIsPieChart] = useState(false);
  const filteredData = data.filter((elem) => elem.date === selectedDate);
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await firestore("getDoc");
      setData(response.data().data);
      setIsLoading(false);
    };
    if (data.length === 0) {
      getData();
    }
  }, []);

  const signOutHandler = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addNewTaskButtonHandler = () => {
    setAdding(true);
  };

  return (
    <>
      {loading ? (
        <LoadingBar />
      ) : (
        <div className="home-page-container">
          <Form.Group className="mb-3">
            <DateInput />
          </Form.Group>

          {isPieChart && !!filteredData.length && <Pie />}
          <Bar />
          {!filteredData[0]?.event.length ? (
            <p style={{ textAlign: "center" }}>You haven`t added any events for this day yet</p>
          ) : (
            <EventList />
          )}
          <div style={{ textAlign: "center" }}>
            <Row>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button className="mt-3" onClick={signOutHandler}>
                  Log out
                </Button>
              </Col>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button className="mt-3" onClick={addNewTaskButtonHandler} variant="secondary">
                  Add new task
                </Button>
              </Col>
              <Col xl={4} m={4} sm={4} xs={12}>
                <Button
                  disabled={!data.length}
                  className="mt-3"
                  onClick={() => {
                    setIsPieChart((prev) => !prev);
                  }}
                >
                  <img style={{ marginRight: "0.5rem" }} src={pieChartIcon} alt="" />
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
