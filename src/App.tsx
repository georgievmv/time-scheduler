import './App.css';
import LoginPage from './pages/LoginPage';
import './bootstrap.min.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useContext, useEffect } from 'react';
import { Context } from './store/app-context';
import HomePage from './pages/HomePage';
import AddEvent from './components/AddEvent';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Calendar from './pages/Calendar';
import { useState } from 'react';
import { openCalendar } from './utils/calendarAnimation';
import useFireStore from './hooks/useFireStore';

function App() {
  const {
    data,
    setData,
    setIsLoading,
    onLogin,
    isCalendarOpened,
    isLoggedIn,
    adding,
    selectedDate,
  } = useContext(Context);
  const [isHomeOpened, setIsHomeOpened] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onLogin(user.uid);
    }
    setIsLoading(false);
  });
  useEffect(() => {
    openCalendar(selectedDate);
  }, [isCalendarOpened]);

  //getting location of click
  /*  const getClickLocationHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setTimeout(() => {
      const homeContainer = document.getElementById('home-container');
      const homeContainerWidth = homeContainer?.offsetWidth;
      const homeContainerHeight = homeContainer?.offsetHeight;
      if (homeContainer && homeContainerHeight && homeContainerWidth && isCalendarOpened) {
        homeContainer.style.top = `${(e.clientY - homeContainerHeight / 2).toString()}px`;
        homeContainer.style.left = `${(e.clientX - homeContainerWidth / 2).toString()}px`;
      }
    }, 5);
  }; */
  useEffect(() => {
    document.getElementById('home-container')?.classList.add('home-already-expanded');
  }, [adding]);

  return (
    <div className="app">
      {(isCalendarOpened || !isHomeOpened) && isLoggedIn && (
        <Calendar setIsHomeOpened={setIsHomeOpened} />
      )}
      <ToastContainer hideProgressBar />
      {!isLoggedIn ? <LoginPage /> : ''}
      {isLoggedIn && adding ? <AddEvent /> : ''}
      {isLoggedIn && !adding && isHomeOpened ? <HomePage setIsHomeOpened={setIsHomeOpened} /> : ''}
    </div>
  );
}

export default App;
