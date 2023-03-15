import Container from "react-bootstrap/Container";
import {MdEmail} from "react-icons/md";
import {RiLockPasswordFill} from 'react-icons/ri';

export default function SignIn() {
  return (
    <Container className="p-3 min-vh-100 bg-opacity-25 d-flex justify-content-center align-items-center">
      <div className="row p-3 m-10 d-flex justify-content-center align-items fw-semibold rounded-4 bg-light border border-opacity-25 border-success">
        <p className="fs-1 text-center fw-bold">Sign in</p>
        <form className="p-3" method="POST">
          <div className="mb-3">
            <label className="form-label gap-1 items-center">
              <MdEmail /> Email Address
            </label>
            <input
              type="email"
              className="form-control bg-opacity-50"
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              name="email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label gap-1 items-center">
              <RiLockPasswordFill/> Password
            </label>
            <input
              type="password"
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              className="form-control "
            />
          </div>
          <button type="submit" className="btn btn-success fw-semibold">
            sign in
          </button>
        </form>
      </div>
    </Container>
  );
}
