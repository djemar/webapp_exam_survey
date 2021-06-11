import { Card, Nav, Button, ListGroup } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/Survey.css";
import QuestionTemplate from "./question_template/QuestionTemplate";
import { useState } from "react";

const questionTemplate = {id: 0, min: 0, max: 0, text: "Type your question here", answers: []};

function SurveyTemplate (props) {
  const [questions, setQuestions] = useState([questionTemplate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: questions.length, min: 0, max: 0, text: "Type your question here", answers: [] }]);
  };

  return (
    <div className='survey-page'>
      <div className='mx-5'>
          {questions.map((q) => (
          <QuestionTemplate key={q.id} questionList={questions} setQuestionList={setQuestions} question={q} />
          ))}
        <Button variant='primary' block className='mb-5 mt-5' onClick={handleAddQuestion}>
          Add a question
        </Button>
        <Button variant='success' block className='mb-5 mt-5'>
          Publish Survey
        </Button>
      </div>
    </div>
  );
};

export default SurveyTemplate;
