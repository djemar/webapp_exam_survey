import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap/";
import "../css/LoginForm.css";

const LoginForm = (props) => {
  const { login, setMessage } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    let valid = true;
    if (username === "" || password === "" || password.length < 6) valid = false;

    if (valid) {
      login(credentials);
    } else {
      setMessage({ msg: `Incorrect email and/or password.`, type: "danger" });
    }
  };

  return (
    <Card id='login-form-root'>
      <Card.Body>
        <Card.Title id='login-title'>Login as Administrator</Card.Title>
        <Form id='login-form'>
          <Form.Group className='m-4' controlId='formPlaintextEmail'>
            <Form.Control placeholder='Username' onInput={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className='m-4' controlId='formPlaintextPassword'>
            <Form.Control type='password' placeholder='Password' onInput={(e) => setPassword(e.target.value)} />
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
