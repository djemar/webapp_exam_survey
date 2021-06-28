import { Card, Button } from "react-bootstrap/";
import "../css/SurveyCard.css";
import { Link } from "react-router-dom";

const SurveyCard = (props) => {
  const { survey } = props;
  return (
    <Card className='survey-card'>
      <Card.Body className='h-100 d-flex flex-column justify-content-between'>
        <Card.Title id='survey-title'>{survey.title}</Card.Title>
        <Link to={`/survey/${survey.surveyId}`}>
          <Button id='btn-survey-card' variant='outline'>
            Take survey
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default SurveyCard;
