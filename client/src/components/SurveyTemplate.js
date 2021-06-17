import { Card, Nav, Button, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Survey.css";
import QuestionTemplate from "./question_template/QuestionTemplate";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const questionTemplate = {
  key: uuidv4(),
  pos: 0,
  min: 0,
  max: 0,
  text: "Type your question here",
  answers: [],
  isSaved: false,
};

function SurveyTemplate(props) {
  const [questions, setQuestions] = useState([questionTemplate]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        key: uuidv4(),
        pos: questions.length,
        min: 0,
        max: 0,
        text: "Type your question here",
        answers: [],
        isSaved: false,
      },
    ]);
  };

  const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children); //enable tooltip only if button is disabled

  return (
    <>
      <h3 id='title-main' className='my-4 text-center'>
        Create Survey
      </h3>
      <div className='survey-page'>
        <div className='mx-5'>
          {questions.map((q) => (
            <QuestionTemplate key={q.key} questionList={questions} setQuestionList={setQuestions} question={q} />
          ))}
          <ConditionalWrapper
            condition={!questions[questions.length - 1].isSaved}
            wrapper={(children) => (
              <OverlayTrigger
                overlay={<Tooltip id='tooltip-disabled'>Save the last question before adding a new one!</Tooltip>}>
                {children}
              </OverlayTrigger>
            )}>
            <span>
              <Button
                variant='primary'
                block
                className='mb-5 mt-5'
                onClick={handleAddQuestion}
                disabled={questions[questions.length - 1].isSaved ? false : true}>
                Add a question
              </Button>
            </span>
          </ConditionalWrapper>
          <ConditionalWrapper
            condition={!questions[questions.length - 1].isSaved}
            wrapper={(children) => (
              <OverlayTrigger
                overlay={<Tooltip id='tooltip-disabled'>Save the last question before publishing the survey!</Tooltip>}>
                {children}
              </OverlayTrigger>
            )}>
            <span>
              <Button
                variant='success'
                block
                className='mb-5 mt-5'
                disabled={questions[questions.length - 1].isSaved ? false : true}>
                Publish Survey
              </Button>
            </span>
          </ConditionalWrapper>
        </div>
      </div>
    </>
  );
}

export default SurveyTemplate;
