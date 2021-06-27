import { Spinner, Button, Form, Card } from "react-bootstrap/";
import OpenEndedQuestion from "./OpenEndedQuestion";
import CloseEndedQuestion from "./CloseEndedQuestion";
import "../css/Survey.css";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API";

function Survey(props) {
  const { setMessage, readOnly, sId, setDirty, handleErrors, sub } = props;
  const params = useParams();
  const [submissionUser, setSubmissionUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [survey, setSurvey] = useState({});
  const [validated, setValidated] = useState(false);
  const [submission, setSubmission] = useState({});
  const [subAnswers, setSubAnswers] = useState([]);
  const history = useHistory();

  const handleInputName = (value) => {
    setSubmissionUser(value);
  };

  const submitSurvey = (sub) => {
    const createSubmission = async () => {
      API.addSubmission(sub)
        .then(() => {
          setDirty(true);
          history.push("/");
          setMessage({ msg: `Submission sent with success!`, type: "success" });
        })
        .catch((err) => handleErrors(err));
    };
    createSubmission();
  };

  const handleSubmit = (e) => {
    //TODO validation
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    //a.text, a.answerId, a.questionId,
    const sub = { ...submission, user: submissionUser, answers: [...subAnswers] };
    submitSurvey(sub);
  };

  useEffect(() => {
    const getSurveyById = async (id) => {
      const survey = await API.getSurveyById(id);
      setSubmission({ submissionId: 0, user: "", answers: [], surveyId: survey.surveyId });
      setSurvey(survey);
      setIsLoading(false);
    };
    if (!readOnly)
      getSurveyById(params.id).catch((err) => {
        setMessage({ msg: `Impossible to load the survey! Please, try again later...`, type: "danger" });
        console.error(err);
      });
    else
      getSurveyById(sId).catch((err) => {
        setMessage({ msg: `Impossible to load the survey! Please, try again later...`, type: "danger" });
        console.error(err);
      });
  }, [sId]);

  return (
    <>
      {isLoading ? (
        <div className='d-flex h-100 flex-column align-items-center justify-content-center'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          <h3 id='title-main' className='my-4 text-center'>
            {survey.title} {sub ? ` - ${sub.user}` : ``}
          </h3>
          <div className='survey-page'>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <h6 className='text-right mx-4'>
                Questions marked with a <span className='mandatory' /> are mandatory
              </h6>
              <Card className='open-question-card'>
                <Card.Body>
                  <Card.Title className='question-text mandatory'>What's your name?</Card.Title>
                  <Form.Group controlId='ControlTextArea-1' className='p-2'>
                    <Form.Control
                      required
                      defaultValue={readOnly ? sub.user : ""}
                      disabled={readOnly}
                      size='lg'
                      type='text'
                      placeholder='John Wick'
                      onInput={(e) => handleInputName(e.target.value)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
              {survey.questions
                .sort((a, b) => a.pos - b.pos)
                .map((q) =>
                  q.max === 0 ? (
                    <OpenEndedQuestion
                      key={q.questionId}
                      question={q}
                      sub={sub}
                      readOnly={readOnly}
                      validated={validated}
                      subAnswers={subAnswers}
                      setSubAnswers={setSubAnswers}
                    />
                  ) : (
                    <CloseEndedQuestion
                      key={q.questionId}
                      question={q}
                      sub={sub}
                      readOnly={readOnly}
                      validated={validated}
                      subAnswers={subAnswers}
                      setSubAnswers={setSubAnswers}
                    />
                  )
                )}
              <h6 className='text-right mx-4'>
                Questions marked with a <span className='mandatory' /> are mandatory{" "}
              </h6>
              {/*TODO hide button if admin*/}
              <Button type='submit' variant='success' className={readOnly ? "invisible mb-5 mt-2" : "mb-5 mt-2"}>
                Send
              </Button>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default Survey;
