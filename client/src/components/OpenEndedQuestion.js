import { Card, Form } from "react-bootstrap/";
import "../css/Question.css";

function OpenQuestion(props) {
  const { question, subAnswers, setSubAnswers, sub, readOnly } = props;

  /*   useEffect(() => {
    setSubAnswers([...subAnswers, { text: "", answerId: 0, questionId: question.questionId }]);
  }, []); */

  const handleInput = (value) => {
    let i = subAnswers.findIndex((it) => it.questionId === question.questionId);
    console.log(value);
    if (i !== -1) {
      let tmp = [...subAnswers];
      tmp[i].text = value;
      setSubAnswers(tmp);
    } else {
      let tmp = [...subAnswers, { text: value, answerId: -1, questionId: question.questionId }];
      setSubAnswers(tmp);
    }
  };

  const readAnswer = () => {
    if (!sub) {
      return;
    }
    const res = sub.answers.find((it) => it.questionId === question.questionId);
    return res ? res.answerText : "";
  };

  return (
    <Card className='open-question-card'>
      <Card.Body>
        <Card.Title className={`question-text ${question.min === 1 ? `mandatory` : ``}`}>
          {question.questionText}
        </Card.Title>
        <Form.Group controlId={`ControlTextArea-${question.questionId}`} className='p-2'>
          <Form.Label>Your answer:</Form.Label>
          <Form.Control
            as='textarea'
            maxLength='200'
            rows={5}
            disabled={readOnly}
            defaultValue={readOnly ? readAnswer() : ""}
            required={question.min === 1}
            onInput={(e) => handleInput(e.target.value)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default OpenQuestion;
