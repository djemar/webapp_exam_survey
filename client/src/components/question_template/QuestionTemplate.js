import { Card, Nav, Button, Form, ListGroup, Row, Col, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { TrashFill, ChevronUp, ChevronDown } from "react-bootstrap-icons";
import "../../css/Question.css";
import { useState } from "react";
import OpenEndedTemplate from "./OpenEndedTemplate";
import CloseEndedTemplate from "./CloseEndedTemplate";

const QUESTION_TYPE = {
  OPEN: 0,
  SINGLE: 1,
  MULTIPLE: 2,
};

function QuestionTemplate(props) {
  const [questionType, setQuestionType] = useState(QUESTION_TYPE.OPEN);

  const handleChangeSelection = (event) => {
    const q = event.target.value;
    if (q == QUESTION_TYPE.OPEN) {
      setQuestionType(QUESTION_TYPE.OPEN);
    } else if (q == QUESTION_TYPE.SINGLE) {
      setQuestionType(QUESTION_TYPE.SINGLE);
    } else if (q == QUESTION_TYPE.MULTIPLE) {
      setQuestionType(QUESTION_TYPE.MULTIPLE);
    }
  };

  return (
    <div className='d-flex flex-row'>
      <Card>
        <Form>
          <Card.Header className='question-template-header'>
            <Form.Group as={Row} controlId='exampleForm.ControlSelect1'>
              <Form.Label column>Type of question:</Form.Label>
              <Col sm='6'>
                <Form.Control as='select' onChange={handleChangeSelection}>
                  <option value={0}>Open-ended question</option>
                  <option value={1}>Single-choice question</option>
                  <option value={2}>Multiple-choice question</option>
                </Form.Control>
              </Col>
            </Form.Group>
            {questionType === QUESTION_TYPE.MULTIPLE ? (
              <Form.Group as={Row} controlId='exampleForm.ControlSelect1'>
                <Form.Label column>Max number of accepted answers (1-10):</Form.Label>
                <Col sm='2'>
                  <Form.Control type='number' min={1} max={10} defaultValue={1} />
                </Col>
              </Form.Group>
            ) : (
              <></>
            )}
          </Card.Header>
          <Card.Body className='closed-question-card'>
            {questionType === QUESTION_TYPE.OPEN ? (
              <OpenEndedTemplate />
            ) : questionType === QUESTION_TYPE.SINGLE ? (
              <CloseEndedTemplate type='radio' />
            ) : (
              <CloseEndedTemplate type='checkbox' />
            )}
          </Card.Body>
          <Card.Footer className='text-right'>
            <Form.Check custom type='switch' id='custom-switch' label='This question is mandatory' />
          </Card.Footer>
        </Form>
      </Card>
      <div id='question-actions' className='ml-3 d-flex flex-column'>
        <ButtonGroup size='sm' vertical aria-label='Move question up/down' className='mb-4'>
          <OverlayTrigger
            key='overlay-move-up'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-up`}>Move up</Tooltip>}>
            <Button className='btn-move-question' variant='light'>
              <ChevronUp />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            key='overlay-move-down'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-down`}>Move down</Tooltip>}>
            <Button className='btn-move-question' variant='light'>
              <ChevronDown />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        <OverlayTrigger
          key='overlay-delete'
          placement='right'
          overlay={<Tooltip id={`tooltip-delete`}>Delete question</Tooltip>}>
          <Button size='sm' variant='danger'>
            <TrashFill />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
}

export default QuestionTemplate;
