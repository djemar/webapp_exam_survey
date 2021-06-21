import { Spinner, Button, Form, Card } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import OpenQuestion from "./OpenQuestion";
import ClosedQuestion from "./ClosedQuestion";
import "../css/Survey.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API";

function Survey(props) {
  const { setMessage, readOnly, sId } = props;
  const params = useParams();
  const [submissionUser, setSubmissionUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [survey, setSurvey] = useState({});

  const handleInputName = (value) => {
    setSubmissionUser(value);
  };

  useEffect(() => {
    const getSurveyById = async (id) => {
      const survey = await API.getSurveyById(id);
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
        //setMessage({ msg: `Impossible to load the survey! Please, try again later...`, type: "danger" });
        console.error(err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className='d-flex h-100 flex-column align-items-center justify-content-center'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <>
          <h3 id='title-main' className='my-4 text-center'>
            {survey.title} {submissionUser.length !== 0 ? ` - ${submissionUser}` : ``}
          </h3>
          <div className='survey-page'>
            <Form noValidate>
              <fieldset disabled={readOnly}>
                <h6 className='text-right mx-4'>
                  Questions marked with a <span className='mandatory' /> are mandatory
                </h6>
                <Card className='open-question-card'>
                  <Card.Body>
                    <Card.Title className='question-text mandatory'>What's your name?</Card.Title>
                    <Form.Group controlId='ControlTextArea-1' className='p-2'>
                      <Form.Control
                        required
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
                      <OpenQuestion key={q.questionId} question={q} />
                    ) : (
                      <ClosedQuestion key={q.questionId} question={q} />
                    )
                  )}
                <h6 className='text-right mx-4'>
                  Questions marked with a <span className='mandatory' /> are mandatory{" "}
                </h6>
                {/*TODO hide button if admin*/}
                <Button type='submit' variant='success' className='mb-5 mt-2'>
                  Send
                </Button>
              </fieldset>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default Survey;
