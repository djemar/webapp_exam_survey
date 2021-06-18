import {
  Card,
  Nav,
  Button,
  Form,
  ListGroup,
  Row,
  Col,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap/";
import {
  TrashFill,
  ChevronUp,
  ChevronDown,
  Check2,
} from "react-bootstrap-icons";
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

  const handleDeleteQuestion = (pos) => {
    let newQuestions = [...questionList];
    newQuestions = newQuestions.filter((item) => item.pos !== pos);
    updateId(newQuestions);
    setQuestionList(newQuestions);
  };

  const checkEmptyAnswers = () => {
    let valid = true;
    answers.forEach((a) => {
      if (a.text.length < 1) valid = false;
    })
    return valid;
  }

  const handleSaveQuestion = () => {
    if (
      question.text.length > 0 &&
     checkEmptyAnswers()
    ) {
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
      q.pos = index; //iterate over array and update ids -> necessary if item from the middle of array is removed
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
      setQuestionType(QUESTION_TYPE.MULTIPLE);
    }
    setQuestionList(tmpQuestions);
  };

  const handleChangeMandatory = (e) => {
    let tmpQuestions = [...questionList];
    const mandatory = e.target.checked;
    if (mandatory) {
      tmpQuestions[question.pos].min = 1;
    } else {
      tmpQuestions[question.pos].min = 0;
    }
    setQuestionList(tmpQuestions);
  };

  const handleMaxChange = (e) => {
    let tmpQuestions = [...questionList];
    const max = parseInt(e.target.value);
    tmpQuestions[question.pos].max = max;
    setQuestionList(tmpQuestions);
  };

  return (
    <div className="d-flex flex-row my-5">
      <Card className="question-card">
        <Card.Header className="question-template-header">
          <Form.Group as={Row} controlId={`form-question-type-${question.key}`}>
            <Form.Label column>Type of question:</Form.Label>
            <Col sm="6">
              <Form.Control
                as="select"
                onChange={handleChangeSelection}
                disabled={question.isSaved}
              >
                <option value={0}>Open-ended question</option>
                <option value={1}>Single-choice question</option>
                <option value={2}>Multiple-choice question</option>
              </Form.Control>
            </Col>
          </Form.Group>
          {questionType === QUESTION_TYPE.MULTIPLE ? (
            <Form.Group as={Row} controlId={`form-max-select-${question.key}`}>
              <Form.Label column>
                Max number of accepted answers (1-10):
              </Form.Label>
              <Col sm="2">
                <Form.Control
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={1}
                  onChange={handleMaxChange}
                />
              </Col>
            </Form.Group>
          ) : (
            <></>
          )}
        </Card.Header>
        <Card.Body className="closed-question-card">
          {questionType === QUESTION_TYPE.OPEN ? (
            <OpenEndedTemplate question={question} />
          ) : questionType === QUESTION_TYPE.SINGLE ? (
            <CloseEndedTemplate
              type="radio"
              question={question}
              answers={answers}
              setAnswers={setAnswers}
            />
          ) : (
            <CloseEndedTemplate
              type="checkbox"
              question={question}
              answers={answers}
              setAnswers={setAnswers}
            />
          )}
        </Card.Body>
        <Card.Footer
          bg="light"
          className="d-flex justify-content-between align-items-center"
        >
          <Button
            variant={`${
              question.isSaved ? "outline-success" : "outline-secondary"
            }`}
            disabled={question.isSaved ? true : false}
            onClick={handleSaveQuestion}
          >
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
            noValidate
            type="switch"
            disabled={question.isSaved}
            id={`custom-switch-mandatory-${question.key}`}
            label="This question is mandatory"
            onChange={handleChangeMandatory}
          />
        </Card.Footer>
      </Card>
      <div id="question-actions" className="ml-3 d-flex flex-column">
        <ButtonGroup
          size="sm"
          vertical
          aria-label="Move question up/down"
          className="mb-5"
        >
          <OverlayTrigger
            key="overlay-move-up"
            placement="right"
            overlay={<Tooltip id={`tooltip-move-up`}>Move up</Tooltip>}
          >
            <Button
              className="btn-move-question"
              variant="outline-primary"
              onClick={handleMoveUp}
              disabled={question.pos === 0}
            >
              <ChevronUp />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            key="overlay-move-down"
            placement="right"
            overlay={<Tooltip id={`tooltip-move-down`}>Move down</Tooltip>}
          >
            <Button
              className="btn-move-question"
              variant="outline-primary"
              onClick={handleMoveDown}
              disabled={question.pos === questionList.length - 1}
            >
              <ChevronDown />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        {question.pos > 0 ? (
          <OverlayTrigger
            key="overlay-delete"
            placement="right"
            overlay={<Tooltip id={`tooltip-delete`}>Delete question</Tooltip>}
          >
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteQuestion(question.pos)}
            >
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
  //TODO https://dev.to/jalal246/moving-element-in-an-array-from-index-to-another-464b
  let numberOfDeletedElm = 1;

  const elm = input.splice(from, numberOfDeletedElm)[0];

  numberOfDeletedElm = 0;

  input.splice(to, numberOfDeletedElm, elm);
}

export default QuestionTemplate;
