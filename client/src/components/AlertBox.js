import { Alert } from "react-bootstrap";

function AlertBox(props) {
  const { alert, setAlert, message } = props;
  if (alert) {
    return (
      <Alert className='mt-3 pb-0' variant={message.type} onClose={() => setAlert(false)} dismissible>
        {message.type === "success" ? <></> : <Alert.Heading>Oh snap! You got an error!</Alert.Heading>}
        <p>{message.msg}</p>
      </Alert>
    );
  } else {
    return <> </>;
  }
}

export default AlertBox;
