import "./App.css";
import LoginPage from "./pages/LoginPage";
import "./bootstrap.min.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useContext } from "react";
import { Context } from "./store/app-context";
import { Button } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import { getDoc } from "firebase/firestore";

function App() {
  const ctx = useContext(Context);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      ctx.onlogin(user.uid);
    }
  });

  return (
    <>
      <div className="app">
        {!ctx.isLoggedIn ? <LoginPage /> : ""}
        {ctx.isLoggedIn ? (
          <div className="chart-container">
            <HomePage />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
