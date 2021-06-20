import { Card, Form } from "react-bootstrap/";
import "../css/Question.css";
import { useState } from "react";

function ClosedQuestion(props) {
  const { question } = props;
  const [checked, setChecked] = useState([]);

  const handleCheck = (e, aId) => {
    if (question.max > 1) {
      if (e.target.checked) {
        setChecked([...checked, aId]);
      } else if (!e.target.checked) {
        let tmpChecked = [...checked];
        setChecked(tmpChecked.filter((c) => c != aId));
      }
    } else {
      setChecked(aId);
    }
  };

  return (
    <Card className='closed-question-card'>
      <Card.Body>
        <Card.Title className={`question-text ${question.min === 1 ? `mandatory` : ``}`}>
          {question.questionText}
        </Card.Title>
        {question.max > 1 ? <h6 className='pb-1 font-italic'>Choose up to {question.max} answers:</h6> : ""}
        <fieldset>
          <Form.Group className='checkbox-group' controlId={`ControlTextArea-${question.questionId}`}>
            {question.answers.map((a) => (
              <Form.Check
                key={`custom-${a.answerId}`}
                custom
                disabled={question.max > 1 && checked.length >= question.max && !checked.includes(a.answerId)}
                onChange={(e) => handleCheck(e, a.answerId)}
                name='form-check'
                type={question.max > 1 ? `checkbox` : `radio`}
                id={`custom-${a.answerId}`}
                className='p-3'
                label={`${a.answerText}`}
              />
            ))}
          </Form.Group>
        </fieldset>
      </Card.Body>
    </Card>
  );
}

export default ClosedQuestion;
