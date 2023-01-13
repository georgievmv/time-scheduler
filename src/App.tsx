import "./App.css";
import LoginPage from "./pages/LoginPage";
import "./bootstrap.min.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useContext, useEffect } from "react";
import { Context } from "./store/app-context";
import HomePage from "./pages/HomePage";
import AddEvent from "./components/AddEvent";

function App() {
  const ctx = useContext(Context);
  const today = `${new Date().getFullYear()}-${new Date().getDay()}-${
    new Date().getMonth() + 1
  }`;
  useEffect(() => {
    ctx.setIsLoading(true);
  }, []);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      ctx.onlogin(user.uid);
    }
    ctx.setIsLoading(false);
  });

  return (
    <>
      <div className="app">
        {!ctx.isLoggedIn ? <LoginPage /> : ""}
        {ctx.isLoggedIn && ctx.adding ? <AddEvent /> : ""}
        {ctx.isLoggedIn && !ctx.adding ? <HomePage /> : ""}
      </div>
    </>
  );
}

export default App;
