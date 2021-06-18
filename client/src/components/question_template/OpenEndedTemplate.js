import { Card, Nav, Button, Form, ListGroup, Row, Col } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../../css/Question.css";

function OpenEndedTemplate(props) {
  const { question, setValidated } = props;
  const handleInputQuestion = (value) => {
    //TODO do not change state directly
    question.text = value;
  };

  return (
    <>
      <Card.Title className='question-text'>
        <Form.Control
          type='text'
          required
          readOnly={question.isSaved}
          placeholder='Type your question here'
          onInput={(e) => handleInputQuestion(e.target.value)}
        />
      </Card.Title>
      <Form.Control disabled as='textarea' maxLength='200' rows={2} placeholder='Answer area (200 characters max)' />
    </>
  );
}

export default OpenEndedTemplate;
