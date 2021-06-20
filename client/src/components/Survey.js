import { Col, Row, Button, Form, Card } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import OpenQuestion from "./OpenQuestion";
import ClosedQuestion from "./ClosedQuestion";
import "../css/Survey.css";

const questions = [1, 2, 3, 4, 5];

function Survey(props) {
  const handleInputName = (value) => {
    //TODO submission.user = value;
  };

  return (
    <>
      <h3 id='title-main' className='my-4 text-center'>
        Survey Title - User
      </h3>
      <div className='survey-page'>
        <Form>
          <h6 className='text-right mx-4'>
            Questions marked with a <span className='mandatory' /> are mandatory
          </h6>
          <Card className='open-question-card'>
            <Card.Body>
              <Card.Title className='question-text mandatory'>What's your name?</Card.Title>
              <Form.Group controlId='ControlTextArea-1' className='p-2'>
                <Form.Control
                  size='lg'
                  type='text'
                  placeholder='John Wick'
                  onInput={(e) => handleInputName(e.target.value)}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          {questions.map((n) => (n % 2 === 0 ? <OpenQuestion key={n} /> : <ClosedQuestion key={n} />))}
          <h6 className='text-right mx-4'>
            Questions marked with a <span className='mandatory' /> are mandatory{" "}
          </h6>
          {/*TODO hide button if admin*/}
          <Button type='submit' variant='success' className='mb-5 mt-2'>
            Send
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Survey;
