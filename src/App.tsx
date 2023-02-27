import "./App.css";
import LoginPage from "./pages/LoginPage";
import "./bootstrap.min.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useContext, useEffect } from "react";
import { Context } from "./store/app-context";
import HomePage from "./pages/HomePage";
import AddEvent from "./components/AddEvent";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const ctx = useContext(Context);

  useEffect(() => {
    ctx.setIsLoading(true);
  }, []);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      ctx.onLogin(user.uid);
    }
    ctx.setIsLoading(false);
  });

  return (
    <>
      <div className="app">
        <ToastContainer hideProgressBar />
        {!ctx.isLoggedIn ? <LoginPage /> : ""}
        {ctx.isLoggedIn && ctx.adding ? <AddEvent /> : ""}
        {ctx.isLoggedIn && !ctx.adding ? <HomePage /> : ""}
      </div>
    </>
  );
}

export default App;
