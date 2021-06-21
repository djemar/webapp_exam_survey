import { Card, Form } from "react-bootstrap/";
import "../css/Question.css";
import { useEffect, useState } from "react";

function ClosedQuestion(props) {
  const { question, validated, subAnswers, setSubAnswers } = props;
  const [checked, setChecked] = useState([]);
  /* 
  useEffect(() => {
    setSubAnswers([...subAnswers, { text: "", answerId: 0, questionId: question.questionId }]);
  }, []); */

  const handleCheck = (e, aId) => {
    let tmp = [...subAnswers];
    let i = subAnswers.findIndex((it) => it.questionId === question.questionId);

    if (question.max > 1) {
      if (e.target.checked) {
        if (i != -1 && tmp[i].answerId === aId) {
          tmp[i].answerId = aId;
          setSubAnswers(tmp);
        } else {
          let tmp = [...subAnswers, { text: "", answerId: aId, questionId: question.questionId }];
          setSubAnswers(tmp);
        }
        setChecked([...checked, aId]);
      } else if (!e.target.checked) {
        let tmpChecked = [...checked];
        setChecked(tmpChecked.filter((c) => c != aId));
        setSubAnswers(tmp.filter((it) => it.answerId !== aId));
      }
    } else {
      if (i != -1) {
        tmp[i].answerId = aId;
        setSubAnswers(tmp);
      } else {
        let tmp = [...subAnswers, { text: "", answerId: aId, questionId: question.questionId }];
        setSubAnswers(tmp);
      }
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
            {question.answers
              .sort((a, b) => a.pos - b.pos)
              .map((a) => (
                <Form.Check
                  key={`custom-${a.answerId}`}
                  custom
                  required={question.min === 1 && checked.length === 0}
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
