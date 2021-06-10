import { Card, Nav, Button, Form, Col, Row } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/LoginForm.css";

const LoginForm = (props) => {
  return (
    <Card id='login-form-root'>
      <Card.Body>
        <Card.Title id='login-title'>Login as Administrator</Card.Title>
        <Form id='login-form'>
          <Form.Group className='m-4' controlId='formPlaintextEmail'>
            <Form.Control placeholder='Username' />
          </Form.Group>
          <Form.Group className='m-4' controlId='formPlaintextPassword'>
            <Form.Control type='password' placeholder='Password' />
          </Form.Group>
          <Button id='btn-form-login' type='submit' className=''>
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
