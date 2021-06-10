import { Card, Nav, Button, Form, ListGroup, Row, Col } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../../css/Question.css";

function OpenEndedTemplate(props) {
  return (
    <>
      <Card.Title className='question-text'>
        <Form.Control type='text' placeholder='Type your question here' />
      </Card.Title>
      <Form.Control disabled as='textarea' maxLength='200' rows={2} placeholder='Answer area (200 characters max)' />
    </>
  );
}

export default OpenEndedTemplate;
