import { Card, Button, Form, Row, Col, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap/";
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

const answerTemplate = { key: uuidv4(), id: 0, text: "" };

function QuestionTemplate(props) {
  const { questionList, setQuestionList, question, setValidated } = props;
  const [questionType, setQuestionType] = useState(QUESTION_TYPE.OPEN);
  const [answers, setAnswers] = useState([answerTemplate]);

  useEffect(() => {
    // if a user saves a question, then exits the creation and then tries to create another survey, the first question data is still present.
    // This should clean it while maintaining the previous key and avoiding rendering issues
    if (question.isSaved) {
      let tmpQuestions = [...questionList];
      tmpQuestions[question.pos] = { ...question, pos: 0, min: 0, max: 0, text: "", answers: [], isSaved: false };
      setQuestionList(tmpQuestions);
    }
  }, []);

  const handleDeleteQuestion = (pos) => {
    let newQuestions = [...questionList];
    newQuestions = newQuestions.filter((item) => item.pos !== pos);
    updateId(newQuestions);
    setQuestionList(newQuestions);
  };

  const checkAnswers = () => {
    let valid = true;
    if (question.max !== 0) {
      answers.forEach((a) => {
        //check for empty
        if (a.text.length < 1) valid = false;
      });
      if (
        (question.max > 1 && question.max > answers.length) ||
        (question.min > 1 && question.min > answers.length) ||
        (question.max !== 0 && question.min > question.max)
      ) {
        //check if there are enough answers if max > 1, min > 1
        valid = false;
      }
    }
    return valid;
  };

  const handleSaveQuestion = () => {
    if (question.text.length > 0 && checkAnswers()) {
      let savedQuestions = [...questionList];
      savedQuestions[question.pos].answers.push(...answers);
      savedQuestions[question.pos].isSaved = true;
      setQuestionList(savedQuestions);
      console.log(question);
    }
    setValidated(true);
  };

  const updateId = (tmpQuestionList) => {
    tmpQuestionList.forEach((q, index) => {
      q.pos = index; //iterate over array and update pos -> necessary if item from the middle of array is removed
    });
  };

  const handleMoveUp = () => {
    const from = question.pos;
    const to = question.pos - 1;
    if (to >= 0) {
      let tmpQuestionList = [...questionList];
      move(tmpQuestionList, from, to);
      updateId(tmpQuestionList);
      setQuestionList(tmpQuestionList);
    }
  };
  const handleMoveDown = () => {
    const from = question.pos;
    const to = question.pos + 1;
    if (to < questionList.length) {
      let tmpQuestionList = [...questionList];
      move(tmpQuestionList, from, to);
      updateId(tmpQuestionList);
      setQuestionList(tmpQuestionList);
    }
  };

  const handleChangeSelection = (e) => {
    let tmpQuestions = [...questionList];
    tmpQuestions[question.pos].answers.length = 0;
    setAnswers([answerTemplate]);

    const q = parseInt(e.target.value);
    if (q === QUESTION_TYPE.OPEN) {
      tmpQuestions[question.pos].max = 0;
      setQuestionType(QUESTION_TYPE.OPEN);
    } else if (q === QUESTION_TYPE.SINGLE) {
      tmpQuestions[question.pos].max = 1;
      setQuestionType(QUESTION_TYPE.SINGLE);
    } else if (q === QUESTION_TYPE.MULTIPLE) {
      tmpQuestions[question.pos].max = 1;
      setQuestionType(QUESTION_TYPE.MULTIPLE);
    }
    setQuestionList(tmpQuestions);
  };

  const handleChangeMandatory = (e) => {
    let tmpQuestions = [...questionList];
    const mandatory = e.target.checked;
    if (mandatory) {
      if (tmpQuestions[question.pos].min === 0) {
        tmpQuestions[question.pos].min = 1;
      }
    } else {
      tmpQuestions[question.pos].min = 0;
    }
    setQuestionList(tmpQuestions);
  };

  const handleMinChange = (e) => {
    let tmpQuestions = [...questionList];
    const min = parseInt(e.target.value);
    tmpQuestions[question.pos].min = min;
    setQuestionList(tmpQuestions);
  };

  const handleMaxChange = (e) => {
    let tmpQuestions = [...questionList];
    const max = parseInt(e.target.value);
    tmpQuestions[question.pos].max = max;
    setQuestionList(tmpQuestions);
  };

  return (
    <div className='d-flex flex-row my-5'>
      <Card className='question-card'>
        <Card.Header className='question-template-header'>
          <Form.Group as={Row} controlId={`form-question-type-${question.key}`}>
            <Form.Label column>Type of question:</Form.Label>
            <Col sm='8'>
              <Form.Control
                className='dont-validate'
                as='select'
                onChange={handleChangeSelection}
                disabled={question.isSaved}>
                <option value={0}>Open-ended question</option>
                <option value={1}>Single-choice question</option>
                <option value={2}>Multiple-choice question</option>
              </Form.Control>
            </Col>
          </Form.Group>

          {questionType === QUESTION_TYPE.MULTIPLE ? (
            <>
              <Form.Group as={Row} controlId={`form-min-select-${question.key}`}>
                <Form.Label column>Minimum number of accepted answers (0-10):</Form.Label>
                <Col sm='4'>
                  <Form.Control
                    type='number'
                    disabled={question.isSaved}
                    className='dont-validate'
                    isInvalid={answers.length < question.min || question.max < question.min}
                    min={0}
                    max={10}
                    value={question.min}
                    defaultValue={0}
                    onChange={handleMinChange}
                  />
                  {question.max < question.min ? (
                    <Form.Control.Feedback type='invalid'>The maximum is less than the minimum.</Form.Control.Feedback>
                  ) : (
                    <Form.Control.Feedback type='invalid'>Not enough answers available.</Form.Control.Feedback>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId={`form-max-select-${question.key}`}>
                <Form.Label column>Maximum number of accepted answers (1-10):</Form.Label>
                <Col sm='4'>
                  <Form.Control
                    type='number'
                    disabled={question.isSaved}
                    className='dont-validate'
                    isInvalid={answers.length < question.max}
                    min={1}
                    max={10}
                    defaultValue={1}
                    onChange={handleMaxChange}
                  />
                  <Form.Control.Feedback type='invalid'>Not enough answers available.</Form.Control.Feedback>
                </Col>
              </Form.Group>
            </>
          ) : (
            <></>
          )}
          <Form.Check
            custom
            className='d-inline float-right'
            type='switch'
            checked={question.min > 0}
            disabled={question.isSaved}
            id={`custom-switch-mandatory-${question.key}`}
            label='This question is mandatory'
            onChange={handleChangeMandatory}
          />
        </Card.Header>
        <Card.Body className='closed-question-card'>
          {questionType === QUESTION_TYPE.OPEN ? (
            <OpenEndedTemplate question={question} questionList={questionList} setQuestionList={setQuestionList} />
          ) : (
            <CloseEndedTemplate
              type={questionType === QUESTION_TYPE.SINGLE ? `radio` : `checkbox`}
              question={question}
              answers={answers}
              setAnswers={setAnswers}
              questionList={questionList}
              setQuestionList={setQuestionList}
            />
          )}
        </Card.Body>
        <Card.Footer bg='light' className='d-flex justify-content-between align-items-center'>
          <Button
            variant={`${question.isSaved ? "outline-success" : "outline-secondary"}`}
            disabled={question.isSaved ? true : false}
            onClick={handleSaveQuestion}>
            {question.isSaved ? (
              <>
                <Check2 size={20} /> Saved
              </>
            ) : (
              <> Save Question </>
            )}
          </Button>
        </Card.Footer>
      </Card>
      <div id='question-actions' className='ml-3 d-flex flex-column'>
        <ButtonGroup size='sm' vertical aria-label='Move question up/down' className='mb-5'>
          <OverlayTrigger
            key='overlay-move-up'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-up`}>Move up</Tooltip>}>
            <Button className='btn-move-question' variant='light' onClick={handleMoveUp} disabled={question.pos === 0}>
              <ChevronUp />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            key='overlay-move-down'
            placement='right'
            overlay={<Tooltip id={`tooltip-move-down`}>Move down</Tooltip>}>
            <Button
              className='btn-move-question'
              variant='light'
              onClick={handleMoveDown}
              disabled={question.pos === questionList.length - 1}>
              <ChevronDown />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        {questionList.length > 1 ? (
          <OverlayTrigger
            key='overlay-delete'
            placement='right'
            overlay={<Tooltip id={`tooltip-delete`}>Delete question</Tooltip>}>
            <Button size='sm' variant='danger' onClick={() => handleDeleteQuestion(question.pos)}>
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
  let deleteCount = 1;

  const elm = input.splice(from, deleteCount)[0]; //remove and return the element from the array

  deleteCount = 0;

  input.splice(to, deleteCount, elm); //add it back in the new position
}

export default QuestionTemplate;
