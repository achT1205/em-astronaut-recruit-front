import { Toast } from "react-bootstrap";
import Link from "next/link";

const DialogBox = ({ closeDilod, dialog }) => {
  return (
    <div>
      {dialog && (
        <Toast bg={dialog.type} onClose={closeDilod}>
          <Toast.Header>
            <strong className="me-auto">{dialog.title}</strong>
          </Toast.Header>
          <Toast.Body>
            {dialog.message}
            {dialog.message === "did not complete profile yet." && (
              <Link href="/registration">{"  Go to Registration"}</Link>
            )}
          </Toast.Body>
        </Toast>
      )}
    </div>
  );
};

export default DialogBox;
