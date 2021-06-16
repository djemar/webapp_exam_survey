import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

import "./../css/Fab.css";
function Fab(props) {
  return (
    <Button variant='primary' className='fab  '>
      <Plus size={30} /> New Survey
    </Button>
  );
}

export default Fab;
