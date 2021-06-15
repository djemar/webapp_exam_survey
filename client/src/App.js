import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import { BrowserRouter as Router, Route, useParams, useHistory, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap/";
import MyNavbar from "./components/Navbar";
import Survey from "./components/Survey";
import LoginForm from "./components/LoginForm";
import SurveyTemplate from "./components/SurveyTemplate";
import SurveyList from "./components/SurveyList";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Container fluid>
        <MyNavbar />
        <Row className='vh-100 below-nav'>
          <Col className='text-center'>
            <Switch>
              <Route exact path='/login'>
                <LoginForm />
              </Route>
              <Route exact path='/'>
                <SurveyList />
              </Route>
              <Route path={["/survey/:id"]}>
                <Survey />
              </Route>
              <Route path={["/admin/mySurveys"]}>
                <AdminDashboard />
              </Route>
              <Route path={["/admin/create"]}>
                <SurveyTemplate />
              </Route>
              {/* TODO different redirects if logged in or not */}
              <Redirect to='/' />
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
