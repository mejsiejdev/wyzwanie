import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";

const Check = () => {
  return (
    <div className="position-absolute min-vh-100 w-100" style={{ zIndex: 1080 }}>
      <div className="position-absolute w-100 bg-dark opacity-25 min-vh-100" />
      <div className="position-absolute w-100 min-vh-100 d-flex align-items-center p-3 justify-content-center">
        <div className="p-3 rounded bg-white">
          <div className="d-flex flex-row gap-5 align-items-center">
            <h2>Check challenge</h2>
            <Link to="/">
              <MdClose className="fs-1 text-black" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Check;
