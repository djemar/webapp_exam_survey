import { Card, Nav, Button, Form, ListGroup, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { Plus, XCircleFill } from "react-bootstrap-icons";
import "../../css/Question.css";
import { useState } from "react";

const answerTemplate = { id: 1, text: "Answer" };

function CloseEndedTemplate(props) {
  const { type } = props;
  const [answers, setAnswers] = useState([answerTemplate]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddAnswer = () => {
    if (answers.length < 10) setAnswers([...answers, { id: answers.length + 1, text: "Answer" }]);
  };

  const handleDeleteAnswer = (id) => {
    setAnswers(answers.filter((item) => item.id !== id));
  };

  return (
    <>
      <Card.Title className='question-text'>
        <Form.Control type='text' placeholder='Type your question here' />
      </Card.Title>
      <Form.Group className={`${type}-group-template`} controlId={`ControlTextArea-{n}`}>
        {answers.map((a) => (
          <div key={a.id} className='my-3 ml-3 d-flex flex-row align-items-center'>
            <Form.Check custom type={type} id={`custom-`} disabled />
            <Form.Control type='text' placeholder={a.text} />
            {a.id > 1 ? (
              <XCircleFill id='btn-delete-answer' size={25} onClick={() => handleDeleteAnswer(a.id)} />
            ) : (
              <> </>
            )}
          </div>
        ))}
        <div className='d-flex justify-content-center'>
          <OverlayTrigger
            key='alert-tooltip'
            placement='top'
            show={showTooltip}
            overlay={<Tooltip id={`tooltip-top`}>You reached the maximum number of answers (10)</Tooltip>}>
            <Button
              id='btn-add-answer'
              disabled={answers.length === 10}
              className='my-3'
              variant='light'
              size='sm'
              onClick={handleAddAnswer}>
              <Plus />
              Add answer
            </Button>
          </OverlayTrigger>
        </div>
      </Form.Group>
    </>
  );
}

export default CloseEndedTemplate;
