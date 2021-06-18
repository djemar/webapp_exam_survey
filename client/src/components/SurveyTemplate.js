import { Card, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Survey.css";
import QuestionTemplate from "./question_template/QuestionTemplate";
import { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const questionTemplate = {
  key: uuidv4(),
  pos: 0,
  min: 0,
  max: 0,
  text: "",
  answers: [],
  isSaved: false,
};

function SurveyTemplate(props) {
  const { publishSurvey, user } = props;
  const [questions, setQuestions] = useState([questionTemplate]);
  const [title, setTitle] = useState("");
  const [validated, setValidated] = useState(false);

  const handleAddQuestion = () => {
    setValidated(false);
    setQuestions([
      ...questions,
      {
        key: uuidv4(),
        pos: questions.length,
        min: 0,
        max: 0,
        text: "",
        answers: [],
        isSaved: false,
      },
    ]);
  };

  const handleSubmit = (event) => {
    //TODO validate
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const survey = {
        title: title,
        adminId: user.id,
        questions: [...questions],
      };
      publishSurvey(survey);
    }
    setValidated(true);
  };

  const handleInputTitle = (value) => {
    setTitle(value);
  };

  const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children); //enable tooltip only if button is disabled

  return (
    <>
      <h3 id='title-main' className='my-4 text-center'>
        Create Survey
      </h3>
      <div className='survey-page'>
        <div className='mx-5'>
          <Form id='form-new-survey' noValidate validated={validated} onSubmit={handleSubmit}>
            <Card className='title-card'>
              <Card.Body>
                <Card.Title className='title-text mandatory'>Insert the title of the survey</Card.Title>
                <Form.Group controlId='ControlTextArea-1' className='p-2'>
                  <Form.Control
                    size='lg'
                    type='text'
                    required
                    placeholder='Never gonna give you up'
                    onInput={(e) => handleInputTitle(e.target.value)}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
            {questions.map((q) => (
              <QuestionTemplate
                key={q.key}
                questionList={questions}
                setQuestionList={setQuestions}
                question={q}
                setValidated={setValidated}
              />
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
                  overlay={
                    <Tooltip id='tooltip-disabled'>Save the last question before publishing the survey!</Tooltip>
                  }>
                  {children}
                </OverlayTrigger>
              )}>
              <span>
                <Button
                  variant='success'
                  block
                  className='mb-5 mt-5'
                  type='submit'
                  disabled={questions[questions.length - 1].isSaved ? false : true}>
                  Publish Survey
                </Button>
              </span>
            </ConditionalWrapper>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SurveyTemplate;
