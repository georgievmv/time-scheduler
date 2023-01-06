import React from "react";
import Pie from "../components/Pie";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Context } from "../store/app-context";
import { Button } from "react-bootstrap";
import useFireStore from "../hooks/useFireStore";
import { useEffect, useState } from "react";
import AddEvent from "../components/AddEvent";

const HomePage = () => {
  const ctx = useContext(Context);
  const firestore = useFireStore();
  const [adding, setAdding] = useState(false);

  const getData = async () => {
    const response = await firestore("getDoc");
    ctx.setData(response.data().data);
  };
  useEffect(() => {
    getData();
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
    setAdding(true);
  };

  return (
    <div className="home-page-container">
      {ctx.data.length === 0 ? (
        <p style={{ textAlign: "center" }}>You haven`t added any events yet</p>
      ) : (
        <Pie />
      )}
      <div style={{ textAlign: "center" }}>
        <Button onClick={signOutHandler}>Logout</Button>
        <Button
          onClick={addNewTaskButtonHandler}
          className="mx-3"
          variant="secondary"
        >
          Add new task
        </Button>
      </div>
      {adding && <AddEvent />}
    </div>
  );
};

export default HomePage;
