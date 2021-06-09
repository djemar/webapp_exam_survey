import { Card, Nav, Button, Form } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Question.css";

const OpenQuestion = (props) => {
  return (
    <Card className='open-question-card'>
      <Card.Body>
        <Card.Title className='question-text'>What's your name?</Card.Title>
        <Form.Group controlId='ControlTextArea-1' className='p-2'>
          <Form.Label>Your answer:</Form.Label>
          <Form.Control as='textarea' maxLength='200' rows={5} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default OpenQuestion;
