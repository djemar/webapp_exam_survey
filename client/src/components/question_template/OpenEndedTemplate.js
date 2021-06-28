import { Card, Form } from "react-bootstrap/";
import "../../css/Question.css";

function OpenEndedTemplate(props) {
  const { question, questionList, setQuestionList } = props;

  const handleInputQuestion = (value) => {
    let tmpQuestions = [...questionList];
    tmpQuestions[question.pos].text = value;
    setQuestionList(tmpQuestions);
    //question.text = value;
  };

  return (
    <>
      <Card.Title className='question-text'>
        <Form.Control
          type='text'
          required
          readOnly={question.isSaved}
          placeholder='Type your question here'
          onInput={(e) => handleInputQuestion(e.target.value)}
        />
      </Card.Title>
      <Form.Control disabled as='textarea' maxLength='200' rows={2} placeholder='Answer area (200 characters max)' />
    </>
  );
}

export default OpenEndedTemplate;
