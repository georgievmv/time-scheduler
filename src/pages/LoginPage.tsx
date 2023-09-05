import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useContext } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Context } from '../store/app-context';
import LoadingBar from '../components/LoadingBar';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loading } = useContext(Context);
  const createAccountClickHandler = () => {
    setIsSignUp((prevState) => !prevState);
  };

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        if (userCredentials) {
          await setDoc(doc(db, 'users', userCredentials.user.uid), {
            data: [],
          });
        }
      } catch (error: any) {
        toast.error(error.code);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if (error.code === 'auth/wrong-password') {
          setErrorMessage('password');
        } else {
          setErrorMessage('userNotFound');
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
                isInvalid={errorMessage === 'userNotFound'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                placeholder="Enter your email"
              ></Form.Control>
              <Form.Control.Feedback type={errorMessage === 'userNotFound' ? 'invalid' : 'valid'}>
                User not found
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={errorMessage === 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Enter your password"
              />
              <Form.Control.Feedback type={errorMessage === 'password' ? 'invalid' : 'valid'}>
                Password is invalid
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              variant={!isSignUp ? 'primary' : 'secondary'}
              className="mt-3 mb-3"
              type="submit"
            >
              {!isSignUp ? 'Log in' : 'Sign in'}
            </Button>
            <p>If you don't have an account click here:</p>
            <Button onClick={createAccountClickHandler}>Create account</Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
