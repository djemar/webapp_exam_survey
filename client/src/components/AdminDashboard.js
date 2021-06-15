import { ListGroup, Col, Row, Carousel } from "react-bootstrap";
import { PersonCheckFill, ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Fab from "./Fab";
import "./../css/AdminDashboard.css";
import Survey from "./Survey";

const surveys = [1, 2, 3, 4, 5];
function AdminDashboard(props) {
  return (
    <>
      <h3 id='title-main' className='my-4 text-center text-uppercase'>
        Your surveys
      </h3>
      <Row>
        <ListGroup as={Col} id='listgroup-admin-surveys' className='m-0 p-0' defaultActiveKey='#1'>
          {surveys.map((s) => (
            <ListGroup.Item
              action
              key={s}
              href={`#${s}`}
              className='py-4 m-0 d-flex justify-content-between align-items-center'>
              Title of your survey
              <div id='n-surveys' className='d-flex flex-row font-weight-bold align-items-center'>
                <PersonCheckFill size={25} className='mr-2 ml-5' /> 158
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Col sm={8} className='m-0'>
          <Carousel
            className='vh-100'
            interval={null}
            controls={true}
            nextIcon={
              <span>
                <ChevronRight size={30} className='carousel-ic' />
              </span>
            }
            prevIcon={
              <span>
                <ChevronLeft size={30} className='carousel-ic' />
              </span>
            }>
            {surveys.map((s) => (
              <Carousel.Item key={s}>
                <Survey />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Link to='/admin/create'>
          <Fab />
        </Link>
      </Row>
    </>
  );
}

export default AdminDashboard;
