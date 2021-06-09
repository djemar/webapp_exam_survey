import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap/";
import MyNavbar from "./js/Navbar";
import SurveyCard from "./js/SurveyCard";
import "./App.css";

const cards = [1, 2, 3, 4, 5];
function App() {
  return (
    <Container fluid>
      <MyNavbar />
      <Row className='vh-100 below-nav'>
        <Col className='text-center'>
          <h3 id='title-main' className='my-4 text-center text-uppercase'>
            Available surveys
          </h3>
          {cards.map((n) => (
            <SurveyCard key={n.toString()} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
