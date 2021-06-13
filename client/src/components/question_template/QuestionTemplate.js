import { Card, Nav, Button, Form, ListGroup, Row, Col, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { TrashFill, ChevronUp, ChevronDown, Check2 } from "react-bootstrap-icons";
import "../../css/Question.css";
import { useEffect, useState } from "react";
import OpenEndedTemplate from "./OpenEndedTemplate";
import CloseEndedTemplate from "./CloseEndedTemplate";

import { v4 as uuidv4 } from "uuid";

const QUESTION_TYPE = {
  OPEN: 0,
  SINGLE: 1,
  MULTIPLE: 2,
};

const answerTemplate = { key: uuidv4(), id: 0, text: "Answer" };

function QuestionTemplate(props) {
  const { questionList, setQuestionList, question } = props;
  const [questionType, setQuestionType] = useState(QUESTION_TYPE.OPEN);
  const [answers, setAnswers] = useState([answerTemplate]);

  const handleDeleteQuestion = (id) => {
    let newQuestions = [...questionList];
    newQuestions = newQuestions.filter((item) => item.id !== id);
    updateId(newQuestions);
    setQuestionList(newQuestions);
  };

  const handleSaveQuestion = () => {
    let savedQuestions = [...questionList];
    savedQuestions[question.id].answers.push(...answers);
    savedQuestions[question.id].isSaved = true;
    setQuestionList(savedQuestions);
    console.log(question);
  };

  const updateId = (tmpQuestionList) => {
    tmpQuestionList.forEach((q, index) => {
      q.id = index; //iterate over array and update ids -> necessary if item from the middle of array is removed
    });
  };

  const handleMoveUp = () => {
    const from = question.id;
    const to = question.id - 1;
    if (to >= 0) {
      let tmpQuestionList = [...questionList];
      move(tmpQuestionList, from, to);
      updateId(tmpQuestionList);
      setQuestionList(tmpQuestionList);
    }
  };
  const handleMoveDown = () => {
    const from = question.id;
    const to = question.id + 1;
    if (to < questionList.length) {
      let tmpQuestionList = [...questionList];
      move(tmpQuestionList, from, to);
      updateId(tmpQuestionList);
      setQuestionList(tmpQuestionList);
    }
  };

  const handleChangeSelection = (e) => {
    let tmpQuestions = [...questionList];
    tmpQuestions[question.id].answers.length = 0;
    setAnswers([answerTemplate]);

    const q = parseInt(e.target.value);
    if (q === QUESTION_TYPE.OPEN) {
      tmpQuestions[question.id].max = 0;
      setQuestionType(QUESTION_TYPE.OPEN);
    } else if (q === QUESTION_TYPE.SINGLE) {
      tmpQuestions[question.id].max = 1;
      setQuestionType(QUESTION_TYPE.SINGLE);
    } else if (q === QUESTION_TYPE.MULTIPLE) {
      setQuestionType(QUESTION_TYPE.MULTIPLE);
    }
    setQuestionList(tmpQuestions);
  };

  const handleChangeMandatory = (e) => {
    let tmpQuestions = [...questionList];
    const mandatory = e.target.checked;
    if (mandatory) {
      tmpQuestions[question.id].min = 1;
    } else {
      tmpQuestions[question.id].min = 0;
    }
    setQuestionList(tmpQuestions);
  };

  const handleMaxChange = (e) => {
    let tmpQuestions = [...questionList];
    const max = parseInt(e.target.value);
    tmpQuestions[question.id].max = max;
    setQuestionList(tmpQuestions);
  };

  return (
    <div className='d-flex flex-row my-5'>
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
                  <Form.Control type='number' min={1} max={10} defaultValue={1} onChange={handleMaxChange} />
                </Col>
              </Form.Group>
            ) : (
              <></>
            )}
          </Card.Header>
          <Card.Body className='closed-question-card'>
            {questionType === QUESTION_TYPE.OPEN ? (
              <OpenEndedTemplate question={question} />
            ) : questionType === QUESTION_TYPE.SINGLE ? (
              <CloseEndedTemplate type='radio' question={question} answers={answers} setAnswers={setAnswers} />
            ) : (
              <CloseEndedTemplate type='checkbox' question={question} answers={answers} setAnswers={setAnswers} />
            )}
          </Card.Body>
          <Card.Footer className='d-flex justify-content-between align-items-center'>
            <Button
              variant={`${question.isSaved ? "outline-success" : "outline-secondary"}`}
              onClick={handleSaveQuestion}>
              {question.isSaved ? (
                <>
                  <Check2 size={20} /> Saved
                </>
              ) : (
                <> Save Question </>
              )}
            </Button>
            <Form.Check
              custom
              type='switch'
              id='custom-switch-mandatory'
              label='This question is mandatory'
              onChange={handleChangeMandatory}
            />
          </Card.Footer>
        </Form>
      </Card>
      <div id='question-actions' className='ml-3 d-flex flex-column'>
        <ButtonGroup size='sm' vertical aria-label='Move question up/down' className='mb-4'>
          <OverlayTrigger
            key='overlay-move-up'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-up`}>Move up</Tooltip>}>
            <Button className='btn-move-question' variant='light' onClick={handleMoveUp}>
              <ChevronUp />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            key='overlay-move-down'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-down`}>Move down</Tooltip>}>
            <Button className='btn-move-question' variant='light' onClick={handleMoveDown}>
              <ChevronDown />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        {question.id > 0 ? (
          <OverlayTrigger
            key='overlay-delete'
            placement='right'
            overlay={<Tooltip id={`tooltip-delete`}>Delete question</Tooltip>}>
            <Button size='sm' variant='danger' onClick={() => handleDeleteQuestion(question.id)}>
              <TrashFill />
            </Button>
          </OverlayTrigger>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
}

function move(input, from, to) {
  //https://dev.to/jalal246/moving-element-in-an-array-from-index-to-another-464b
  let numberOfDeletedElm = 1;

  const elm = input.splice(from, numberOfDeletedElm)[0];

  numberOfDeletedElm = 0;

  input.splice(to, numberOfDeletedElm, elm);
}

export default QuestionTemplate;
