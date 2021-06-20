import { Card, Nav, Button } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/SurveyCard.css";
import { Link } from "react-router-dom";

const SurveyCard = (props) => {
  const { survey } = props;
  return (
    <Card className='survey-card'>
      <Card.Body>
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
