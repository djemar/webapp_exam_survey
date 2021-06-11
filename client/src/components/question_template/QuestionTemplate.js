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

const answerTemplate = { id: 0, text: "Answer" };

function QuestionTemplate(props) {
  const [questionType, setQuestionType] = useState(QUESTION_TYPE.OPEN);
  const { questionList, setQuestionList, question } = props;
  const [answers, setAnswers] = useState([answerTemplate]);

  const handleDeleteQuestion = (id) => {
    let newQuestions = [...questionList];
    newQuestions = newQuestions.filter((item) => item.id !== id);
    newQuestions.forEach((q, index) => {
      q.id = index; //iterate over array and update ids -> necessary if item from the middle of array is removed
    });
    setQuestionList(newQuestions);
  };

  const handleSaveQuestion = () => {
    question.answers.push(...answers);
    console.log(question);
  };

  const handleChangeSelection = (e) => {
    question.answers.length = 0;
    setAnswers([answerTemplate]);

    const q = parseInt(e.target.value);
    if (q === QUESTION_TYPE.OPEN) {
      question.max = 0;
      setQuestionType(QUESTION_TYPE.OPEN);
    } else if (q === QUESTION_TYPE.SINGLE) {
      question.max = 1;
      setQuestionType(QUESTION_TYPE.SINGLE);
    } else if (q === QUESTION_TYPE.MULTIPLE) {
      setQuestionType(QUESTION_TYPE.MULTIPLE);
    }
  };

  const handleChangeMandatory = (e) => {
    const mandatory = e.target.checked;
    if (mandatory) {
      question.min = 1;
    } else {
      question.min = 0;
    }
  };

  const handleMaxChange = (e) => {
    const max = parseInt(e.target.value);
      question.max = max;

  };

  return (
    <div className="d-flex flex-row my-5">
      <Card>
        <Form>
          <Card.Header className="question-template-header">
            <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
              <Form.Label column>Type of question:</Form.Label>
              <Col sm="6">
                <Form.Control as="select" onChange={handleChangeSelection}>
                  <option value={0}>Open-ended question</option>
                  <option value={1}>Single-choice question</option>
                  <option value={2}>Multiple-choice question</option>
                </Form.Control>
              </Col>
            </Form.Group>
            {questionType === QUESTION_TYPE.MULTIPLE ? (
              <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
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
              <OpenEndedTemplate />
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
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={handleSaveQuestion}>
              Save Question
            </Button>
            <Form.Check
              custom
              type="switch"
              id="custom-switch-mandatory"
              label="This question is mandatory"
              onChange={handleChangeMandatory}
            />
          </Card.Footer>
        </Form>
      </Card>
      <div id="question-actions" className="ml-3 d-flex flex-column">
        <ButtonGroup
          size="sm"
          vertical
          aria-label="Move question up/down"
          className="mb-4"
        >
          <OverlayTrigger
            key="overlay-move-up"
            placement="right"
            overlay={<Tooltip id={`tooltip-move-up`}>Move up</Tooltip>}
          >
            <Button className="btn-move-question" variant="light">
              <ChevronUp />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            key="overlay-move-down"
            placement="right"
            overlay={<Tooltip id={`tooltip-move-down`}>Move down</Tooltip>}
          >
            <Button className="btn-move-question" variant="light">
              <ChevronDown />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        <OverlayTrigger
          key="overlay-delete"
          placement="right"
          overlay={<Tooltip id={`tooltip-delete`}>Delete question</Tooltip>}
        >
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteQuestion(question.id)}
          >
            <TrashFill />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
}

export default QuestionTemplate;
