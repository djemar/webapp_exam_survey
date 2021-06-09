import { React } from "react";
import { BrowserRouter as Router, Route, useParams, useHistory, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap/";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNavbar from "./components/Navbar";
import SurveyCard from "./components/SurveyCard";
import Survey from "./components/Survey";

const cards = [1, 2, 3, 4, 5];
function App() {
  return (
    <Container fluid>
      <MyNavbar />
      <Row className='vh-100 below-nav'>
        <Col className='text-center p-0'>
          <Router>
            <Switch>
              <Route exact path='/'>
                <h3 id='title-main' className='my-4 text-center text-uppercase'>
                  Available surveys
                </h3>
                {cards.map((n) => (
                  <SurveyCard key={n.toString()} />
                ))}
              </Route>
              <Route path={["/survey/:id"]}>
                <h3 id='title-main' className='my-4 text-center'>
                  Survey Title
                </h3>
                <Survey />
              </Route>
              <Redirect to='/' />
            </Switch>
          </Router>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
