import { Card, Nav, Button, Form, ListGroup, Row, Col } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Question.css";

const answers = [1, 2, 3, 4];

const ClosedQuestion = (props) => {
  return (
    <Card className='closed-question-card'>
      <Card.Body>
        <Card.Title className='question-text'>Who wants to live forever? (TODO: max answers: 2)</Card.Title>
        <Form.Group className='checkbox-group' controlId={`ControlTextArea-{n}`}>
          {answers.map((n) => (
            <Form.Check custom type='checkbox' id={`custom-${n}`} className='p-3' label='Freddie Mercury' />
          ))}
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ClosedQuestion;
