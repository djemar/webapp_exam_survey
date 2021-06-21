import { ListGroup, Col, Row, Carousel, Tab } from "react-bootstrap";
import { PersonCheckFill, ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Fab from "./Fab";
import "./../css/AdminDashboard.css";
import Survey from "./Survey";
import { useState } from "react";

const surveys = [1, 2, 3, 4, 5];
function AdminDashboard(props) {
  const { surveys } = props;
  const [selectedSId, setSelectedSId] = useState("");

  const handleClick = (sId) => {
    setSelectedSId(sId);
  };

  return (
    <>
      <h3 id='title-main' className='my-4 text-center text-uppercase'>
        Your surveys
      </h3>
      <Tab.Container id='list-group-tabs-example'>
        <Row className='h-ms'>
          <ListGroup as={Col} id='listgroup-admin-surveys' className='pl-3 pr-0 '>
            {surveys.map((s) => (
              <ListGroup.Item
                id='dashboard-list'
                action
                href={`#${s.surveyId}`}
                key={s.surveyId}
                onClick={() => handleClick(s.surveyId)}
                className='py-3 m-0 d-flex justify-content-between align-items-center'>
                {s.title}
                <div id='n-surveys' className='d-flex flex-row font-weight-bold align-items-center'>
                  <PersonCheckFill size={25} className='mr-2 ml-5' /> 158
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Col sm={8} id='carousel-col' className='p-0 m-0'>
            <Carousel
              className=''
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
              {/*TODO map submissions */}
              {surveys
                .filter((s) => s.surveyId === selectedSId)
                .map((s) => (
                  <Carousel.Item key={s.surveyId}>
                    <Tab.Content>
                      <Tab.Pane eventKey={`#${s.surveyId}`}>
                        <Survey readOnly={true} sId={s.surveyId} />
                      </Tab.Pane>
                    </Tab.Content>
                  </Carousel.Item>
                ))}
            </Carousel>
          </Col>
          <Link to='/admin/create'>
            <Fab />
          </Link>
        </Row>
      </Tab.Container>
    </>
  );
}

export default AdminDashboard;
