import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap/";
import "../css/LoginForm.css";

const LoginForm = (props) => {
  const { login, setMessage } = props;
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    const credentials = { username, password };
    let valid = true;
    if (username === "" || password === "" || password.length < 6) valid = false;
    if (form.checkValidity() === true && valid) {
      login(credentials);
    } else {
      setMessage({ msg: `Incorrect email and/or password.`, type: "danger" });
    }
    setValidated(true);
  };

  return (
    <Card id='login-form-root'>
      <Card.Body>
        <Card.Title id='login-title'>Login as Administrator</Card.Title>
        <Form id='login-form' noValidate validated={validated}>
          <Form.Group className='m-4' controlId='formPlaintextUsername'>
            <Form.Control required type='text' placeholder='Username' onInput={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className='m-4' controlId='formPlaintextPassword'>
            <Form.Control
              required
              type='password'
              placeholder='Password'
              onInput={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button id='btn-form-login' type='submit' onClick={handleSubmit}>
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
