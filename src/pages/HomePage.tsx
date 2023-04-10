import Pie from '../components/Pie';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Context } from '../store/app-context';
import { Button, Row, Col, Form } from 'react-bootstrap';
import useFireStore from '../hooks/useFireStore';
import { useEffect, useState, useContext, useRef } from 'react';
import EventList from '../components/EventList';
import Bar from '../components/Bar/Bar';
import LoadingBar from '../components/LoadingBar';
import pieChartIcon from '../assets/pie-chart-fill.svg';
import { toast } from 'react-toastify';
import DateInput from '../components/DateInput';
import calendarIcon from '../assets/icons8-tear-off-calendar-50.png';

const HomePage: React.FC<{
  setIsHomeOpened: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsHomeOpened }) => {
  const {
    setIsCalendarOpened,
    selectedDate,
    data,
    setIsLoading,
    onLogout,
    setData,
    setAdding,
    loading,
  } = useContext(Context);
  const homeContainer = useRef<HTMLDivElement>(null);
  const firestore = useFireStore();
  const [isPieChart, setIsPieChart] = useState(false);
  const filteredData = data.filter((elem) => elem.date === selectedDate);
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const response = await firestore('getDoc');
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

  const openCalendarClickHandler = () => {
    homeContainer.current?.classList.add('shrinkHome');
    setIsCalendarOpened(true);
    setTimeout(() => {
      setIsHomeOpened(false);
    }, 800);
  };

  return (
    <div ref={homeContainer} id="home-container" className="home-container">
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
            <p style={{ textAlign: 'center' }}>You haven`t added any events for this day yet</p>
          ) : (
            <EventList />
          )}
          <div style={{ textAlign: 'center' }}>
            <Row>
              <Col xl={6} m={6} sm={6} xs={12}>
                <Button className="mt-3 w-50" onClick={addNewTaskButtonHandler} variant="secondary">
                  Add new task
                </Button>
              </Col>
              <Col xl={6} m={6} sm={6} xs={12}>
                <Button
                  disabled={!filteredData[0]?.event.length}
                  className="mt-3 w-50"
                  onClick={() => {
                    setIsPieChart((prev) => !prev);
                  }}
                >
                  <img style={{ marginRight: '0.5rem' }} src={pieChartIcon} alt="" />
                  Pie chart
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xl={6} m={6} sm={6} xs={12}>
                <Button
                  disabled={!data.length}
                  className="mt-3 w-50"
                  onClick={openCalendarClickHandler}
                >
                  <img
                    style={{ marginRight: '0.5rem', height: '20px' }}
                    src={calendarIcon}
                    alt=""
                  />
                  Calendar
                </Button>
              </Col>
              <Col xl={6} m={6} sm={6} xs={12}>
                <Button className="mt-3 w-50" onClick={signOutHandler}>
                  Log out
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
