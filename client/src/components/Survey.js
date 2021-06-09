import { Card, Nav, Button } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import OpenQuestion from "./OpenQuestion";
import ClosedQuestion from "./ClosedQuestion";
import "../css/Survey.css";

const questions = [1, 2, 3, 4, 5];

const Survey = (props) => {
  return (
    <div className='survey-page'>
      {questions.map((n) => (n % 2 === 0 ? <OpenQuestion /> : <ClosedQuestion />))}
      <Button variant='success' className='mb-5 mt-2'>
        Send
      </Button>
    </div>
  );
};

export default Survey;
