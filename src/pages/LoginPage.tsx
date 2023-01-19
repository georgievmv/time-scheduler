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
  const [error, setError] = useState("");
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
        alert(error.message);
      }
    } else {
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (error: any) {
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          setError("password");
        } else {
          setError("userNotFound");
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <LoadingBar />
      ) : (
        <div className="form-container">
          <Form className="mt-4" onSubmit={formSubmitHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                isInvalid={error === "userNotFound"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="Enter your email"
              ></Form.Control>
              <Form.Control.Feedback
                type={error === "userNotFound" ? "invalid" : "valid"}
              >
                User not found
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={error === "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Enter your password"
              />
              <Form.Control.Feedback
                type={error === "password" ? "invalid" : "valid"}
              >
                Password is invalid
              </Form.Control.Feedback>
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
