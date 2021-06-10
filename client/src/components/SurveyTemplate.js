import { Card, Nav, Button, ListGroup } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Survey.css";
import QuestionTemplate from "./question_template/QuestionTemplate";

const questions = [1, 2, 3, 4, 5];

const SurveyTemplate = (props) => {
  return (
    <div className='survey-page'>
      <div className='mx-5'>
        <ListGroup>
          <QuestionTemplate />
        </ListGroup>
        <Button variant='primary' block className='mb-5 mt-5'>
          Add a question
        </Button>
        <Button variant='success' className='mb-5 mt-5'>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default SurveyTemplate;
