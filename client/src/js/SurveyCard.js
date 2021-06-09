import { Card, Nav, Button } from "react-bootstrap/";
import { PencilSquare } from "react-bootstrap-icons";
import "../css/SurveyCard.css";

const SurveyCard = (props) => {
  return (
    <Card className='survey-card'>
      <Card.Body>
        <Card.Title id='survey-title'>Survey Title Incredible Amazing</Card.Title>
        <Card.Text>by Diego Marino</Card.Text>
        <Button id='btn-survey-card' variant='outline' className='text-uppercase'>
          Take survey
        </Button>
      </Card.Body>
    </Card>
  );
};

export default SurveyCard;
