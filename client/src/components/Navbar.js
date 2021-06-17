import { Navbar, Nav, Button } from "react-bootstrap/";
import { PersonFill, JournalCheck, BoxArrowLeft } from "react-bootstrap-icons";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

const MyNavbar = (props) => {
  const { loggedIn, user, logout } = props;
  return (
    <Navbar id='navbar' variant='light' fixed='top' className='px-3 d-flex flex-row justify-content-between'>
      {/* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> */}
      <Navbar.Toggle aria-controls='left-sidebar' />
      <Link id='nav-home' to='/'>
        <Navbar.Brand id='navbar-brand'>
          <JournalCheck className='mr-1' size='30' /> Survey.me
        </Navbar.Brand>
      </Link>
      <Nav className='ml-auto'>
        <Nav.Item>
          {loggedIn ? (
            <div className='d-flex flex-row align-items-center'>
              <h5 id='nav-username' className='mx-4 my-0'>
                Hi, {user.username}
              </h5>
              <Button id='btn-login' variant='primary' onClick={logout}>
                <BoxArrowLeft size='20' className='m-1' /> Logout
              </Button>
            </div>
          ) : (
            <Link to='/login'>
              <Button id='btn-login' variant='primary'>
                <PersonFill size='20' className='m-1' /> Login
              </Button>
            </Link>
          )}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
