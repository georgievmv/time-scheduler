import React from "react";
import { Form, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useContext } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Context } from "../store/app-context";
import LoadingBar from "../components/LoadingBar";

const LoginPage: React.FC = () => {
  const [signIn, setSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useContext(Context);
  const paragraphClickHandler = () => {
    setSignIn((prevState) => !prevState);
  };

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (userCredentials) {
          await setDoc(doc(db, "users", userCredentials.user.uid), {
            data: [],
          });
        }
      } catch (error: any) {
        console.log(error.message);
      }
    } else {
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      {ctx.loading ? (
        <LoadingBar />
      ) : (
        <div className="form-container">
          <Form onSubmit={formSubmitHandler}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="Enter your email"
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Enter your password"
              ></Form.Control>
            </Form.Group>
            <Button
              variant={!signIn ? "primary" : "secondary"}
              className="mt-3 mb-3"
              type="submit"
            >
              {!signIn ? "Log in" : "Sign in"}
            </Button>
            <p style={{ cursor: "pointer" }} onClick={paragraphClickHandler}>
              If you dont have an account click here
            </p>
          </Form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
