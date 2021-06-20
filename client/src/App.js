import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap/";
import MyNavbar from "./components/Navbar";
import Survey from "./components/Survey";
import LoginForm from "./components/LoginForm";
import SurveyTemplate from "./components/SurveyTemplate";
import SurveyList from "./components/SurveyList";
import AdminDashboard from "./components/AdminDashboard";
import API from "./API";

function App() {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();

        setUser(user);
        setLoggedIn(true);
        setLoading(false);
      } catch (err) {
        console.error(err.error);
        //setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const doLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: "success" });
      setUser(user);
    } catch (err) {
      console.log(err);
      setMessage({ msg: err.error, type: "danger" });
    }
  };

  const doLogout = async () => {
    try {
      await API.logout();
      setLoggedIn(false);
      //setAlert(false);
      setUser("");
      //setTasks([]);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const handleErrors = (err) => {
    if (err.errors) setMessage({ msg: err.errors[0].msg + ": " + err.errors[0].param, type: "danger" });
    else setMessage({ msg: err.error, type: "danger" });

    setDirty(true);
  };

  useEffect(() => {
    const getSurveys = async () => {
      const surveys = await API.getSurveys();
      setSurveys(surveys);
      setLoading(false);
    };
    if (!loggedIn)
      getSurveys().catch((err) => {
        setMessage({ msg: `Impossible to load the surveys! Please, try again later...`, type: "danger" });
        console.error(err);
      });
  }, []);

  const publishSurvey = (survey) => {
    //    setSurveys((surveys) => [...surveys, survey]);
    const createSurvey = async () => {
      API.addSurvey(survey)
        .then(() => {
          // setDirty(true);
          setMessage({ msg: `Survey published with success!`, type: "success" });
        })
        .catch((err) => handleErrors(err));
    };
    createSurvey();
  };

  return (
    <Router>
      <Container fluid className='h-100'>
        <MyNavbar loggedIn={loggedIn} logout={doLogout} user={user} />
        <Row className='vh-100 below-nav'>
          <Col className='text-center'>
            <Route
              exact
              path='/'
              render={() => <>{loggedIn ? <Redirect to='/admin/mySurveys' /> : <SurveyList surveys={surveys} />}</>}
            />
            <Switch>
              <Route
                exact
                path='/login'
                render={() => (
                  <>
                    {loggedIn ? (
                      <Redirect to='/admin/mySurveys' />
                    ) : (
                      <LoginForm login={doLogin} setMessage={setMessage} />
                    )}
                  </>
                )}
              />
              <Route
                exact
                path={["/survey/:id"]}
                render={() => (
                  <>
                    {loggedIn ? (
                      <Redirect to='/admin/mySurveys' />
                    ) : loading ? (
                      <div className='d-flex h-100 flex-column align-items-center justify-content-center'>
                        <Spinner animation='border' variant='primary' />
                      </div>
                    ) : (
                      <Survey setMessage={setMessage} />
                    )}
                  </>
                )}
              />
              <Route
                exact
                path={["/admin/mySurveys"]}
                render={() => (
                  <>
                    {loggedIn ? (
                      <AdminDashboard publishSurvey={publishSurvey} surveys={surveys} />
                    ) : loading ? (
                      <div className='d-flex h-100 flex-column align-items-center justify-content-center'>
                        <Spinner animation='border' variant='primary' />
                      </div>
                    ) : (
                      <Redirect to='/login' />
                    )}
                  </>
                )}
              />
              <Route
                exact
                path={["/admin/create"]}
                render={() => (
                  <>
                    {loggedIn ? (
                      <SurveyTemplate publishSurvey={publishSurvey} user={user} />
                    ) : loading ? (
                      <div className='d-flex h-100 flex-column align-items-center justify-content-center'>
                        <Spinner animation='border' variant='primary' />
                      </div>
                    ) : (
                      <Redirect to='/login' />
                    )}
                  </>
                )}
              />
              <Redirect to='/' />
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
