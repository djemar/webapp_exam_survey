import {
  Card,
  Button,
  Form,
} from "react-bootstrap/";
import { Plus, XCircleFill } from "react-bootstrap-icons";
import "../../css/Question.css";
import { v4 as uuidv4 } from "uuid";

function CloseEndedTemplate(props) {
  const { type, question, answers, setAnswers } = props;

  const handleAddAnswer = () => {
    if (answers.length < 10)
      setAnswers([
        ...answers,
        { key: uuidv4(), id: answers.length, text: "" },
      ]);
  };

  const handleInputAnswer = (a, value) => {
    let tmpAnswers = [...answers];
    let edit = {
      ...tmpAnswers[a.id],
      text: value,
    };
    tmpAnswers[a.id] = edit;

    setAnswers(tmpAnswers);
  };

  const handleInputQuestion = (value) => {
    //TODO do not change state directly
    question.text = value;
  };

  const handleDeleteAnswer = (id) => {
    let newAnswers = [...answers];
    newAnswers = newAnswers.filter((item) => item.id !== id);
    newAnswers.forEach((a, index) => {
      a.id = index; //iterate over array and update ids -> necessary if item from the middle of array is removed
    });
    setAnswers(newAnswers);
  };

  return (
    <>
      <Card.Title className="question-text">
        <Form.Control
          type="text"
          required
          readOnly={question.isSaved}
          placeholder="Type your question here"
          onInput={(e) => handleInputQuestion(e.target.value)}
        />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
      </Card.Title>
      <Form.Group
        className={`${type}-group-template`}
        controlId={`ControlTextArea-${question.key}`}
      >
        {answers.map((a) => (
          <div
            key={a.key}
            className="my-3 ml-3 d-flex flex-row align-items-center"
          >
            <Form.Check custom type={type} id={`custom-check-${question.key}`} disabled />
            <Form.Control
              type="text"
              required
              readOnly={question.isSaved}
              placeholder="Answer"
              onInput={(e) => handleInputAnswer(a, e.target.value)}
            />
            {a.id > 0 && !question.isSaved ? (
              <XCircleFill
                id="btn-delete-answer"
                size={25}
                onClick={() => handleDeleteAnswer(a.id)}
              />
            ) : (
              <> </>
            )}
          </div>
        ))}
          {question.isSaved? <></> :
        <div className="d-flex justify-content-center">
          <Button
            id="btn-add-answer"
            disabled={answers.length === 10}
            className="my-3"
            variant="light"
            size="sm"
            onClick={handleAddAnswer}
          >
            <Plus />
            Add answer
          </Button>
        </div>}
      </Form.Group>
    </>
  );
}

export default CloseEndedTemplate;
