import { Card, Nav, Button, Form } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Question.css";

function OpenQuestion(props) {
  const { question } = props;
  return (
    <Card className='open-question-card'>
      <Card.Body>
        <Card.Title className={`question-text ${question.min === 1 ? `mandatory` : ``}`}>
          {question.questionText}
        </Card.Title>
        <Form.Group controlId={`ControlTextArea-${question.questionId}`} className='p-2'>
          <Form.Label>Your answer:</Form.Label>
          <Form.Control as='textarea' maxLength='200' rows={5} />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default OpenQuestion;
