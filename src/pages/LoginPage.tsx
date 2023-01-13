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
  const [IsSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading } = useContext(Context);
  const createAccountClickHandler = () => {
    setIsSignIn((prevState) => !prevState);
  };

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IsSignIn) {
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
      {loading ? (
        <LoadingBar />
      ) : (
        <div className="form-container">
          <Form onSubmit={formSubmitHandler}>
            <Form.Group controlId="formBasicEmail">
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
            <Form.Group controlId="formBasicPassword">
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
              variant={!IsSignIn ? "primary" : "secondary"}
              className="mt-3 mb-3"
              type="submit"
            >
              {!IsSignIn ? "Log in" : "Sign in"}
            </Button>
            <p>If you dont have an account click here:</p>
            <Button onClick={createAccountClickHandler}>Create account</Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
