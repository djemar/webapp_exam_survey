import { ListGroup, Col, Row, Carousel, Tab } from "react-bootstrap";
import { PersonCheckFill, ChevronRight, ChevronLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Fab from "./Fab";
import "./../css/AdminDashboard.css";
import Survey from "./Survey";
import { useEffect, useState } from "react";
import API from "../API";

function AdminDashboard(props) {
  const { surveys, user, setLoading, dirty, setDirty, setMessage } = props;
  const [index, setIndex] = useState(0);
  const [selectedSId, setSelectedSId] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setDirty(true);
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const getSubmissions = async () => {
      const submissions = await API.getSubmissions();
      setSubmissions(submissions);
      setLoading(false);
      setDirty(false);
    };
    getSubmissions().catch((err) => {
      setMessage({ msg: `Impossible to load the submissions! Please, try again later...`, type: "danger" });
      console.error(err);
    });
  }, [dirty, submissions.length]);

  const handleClick = (sId) => {
    setIndex(0);
    setSelectedSId(sId);
  };

  return (
    <>
      <h3 id='title-main' className='my-4 text-center text-uppercase'>
        Your surveys
      </h3>
      <Row className='h-ms'>
        <ListGroup as={Col} id='listgroup-admin-surveys' className='pl-3 pr-0 '>
          {surveys
            .filter((it) => it.adminId === user.id)
            .map((s) => (
              <ListGroup.Item
                id='dashboard-list'
                action
                href={`#${s.surveyId}`}
                key={s.surveyId}
                onClick={() => handleClick(s.surveyId)}
                className='py-3 m-0 d-flex justify-content-between align-items-center'>
                {s.title}
                <div id='n-surveys' className='d-flex flex-row font-weight-bold align-items-center'>
                  <PersonCheckFill size={25} className='mr-2 ml-5' />
                  {submissions.filter((it) => it.surveyId === s.surveyId).length}
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
        <Col sm={8} id='carousel-col' className='p-0 m-0'>
          {selectedSId != "" ? (
            submissions.filter((it) => it.surveyId === selectedSId).length > 0 ? (
              <Carousel
                className=''
                activeIndex={index}
                onSelect={handleSelect}
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
                {submissions
                  .filter((s) => s.surveyId === selectedSId)
                  .map((s, index) => (
                    <Carousel.Item key={index}>
                      <Survey readOnly={true} sId={selectedSId} sub={s} />
                    </Carousel.Item>
                  ))}
              </Carousel>
            ) : (
              <h4 className='mt-3'>No submissions yet.</h4>
            )
          ) : (
            <h4 className='mt-3'>Select a survey on the left to view the submissions.</h4>
          )}
        </Col>
        <Link to='/admin/create'>
          <Fab />
        </Link>
      </Row>
    </>
  );
}

export default AdminDashboard;
