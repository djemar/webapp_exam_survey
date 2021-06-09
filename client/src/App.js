import { React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap/";
import MyNavbar from "./js/Navbar";
import "./App.css";

function App() {
  return (
    <Container fluid>
      <MyNavbar />
      <Row className='vh-100' />
    </Container>
  );
}

export default App;
