import React from "react";
import Pie from "../components/Pie";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Context } from "../store/app-context";
import { Button } from "react-bootstrap";
import useFireStore from "../hooks/useFireStore";
import { useEffect, useState } from "react";
import EventList from "../components/EventList";
import Bar from "../components/Bar";
import LoadingBar from "../components/LoadingBar";

const HomePage = () => {
  const ctx = useContext(Context);
  const firestore = useFireStore();

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
          <Bar />
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
            <Button onClick={signOutHandler}>Logout</Button>
            <Button
              onClick={addNewTaskButtonHandler}
              className="mx-3"
              variant="secondary"
            >
              Add new task
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
