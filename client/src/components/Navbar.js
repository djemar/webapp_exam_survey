import { Navbar, Nav, Button } from "react-bootstrap/";
import { PersonFill, JournalCheck } from "react-bootstrap-icons";
import "../css/Navbar.css";

const MyNavbar = (props) => {
  return (
    <Navbar id='navbar' variant='light' fixed='top' className='px-3 d-flex justify-content-between'>
      {/* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> */}
      <Navbar.Toggle aria-controls='left-sidebar' />
      <Navbar.Brand id='navbar-brand' href='/'>
        <JournalCheck className='mr-1' size='30' /> Survey.me
      </Navbar.Brand>
      <Nav className='ml-auto'>
        <Nav.Item>
          <Nav.Link href='#'>
            <Button id='btn-login' variant='primary' className='text-uppercase'>
              <PersonFill size='20' className='m-1' /> Login
            </Button>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default MyNavbar;
