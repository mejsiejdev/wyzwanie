import { Button } from "react-bootstrap";
import { MdArrowBackIosNew, MdPerson } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

export const loader = async ({ params }: { params: { name: string } }) => {
  try {
    const response = await fetch(`http://localhost:8000/user/${params.name}`, {
      method: "GET",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    });
    if (!response.ok) throw new Error();

    const data = await response.json();
    return data;
  } catch {
    throw new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const user = useLoaderData() as {
    id: string;
    name: string;
    password: string;
    photo: string | null;
    points: number;
    createdAt: Date;
    updatedAt: Date;
    owner: boolean;
  };
  return (
    <div className="d-flex flex-column gap-3 w-100">
      <Link to="/">
        <MdArrowBackIosNew className="fs-3 my-3" />
      </Link>
      <div className="d-flex flex-column flex-sm-row gap-4 align-items-center justify-content-between w-100">
        <div className="d-flex flex-column flex-sm-row gap-4 align-items-center">
          {user.photo != null ? (
            <img
              src={user.photo}
              alt={user.name}
              className="rounded-circle object-fit-cover"
              style={{ maxWidth: "12rem", width: "10rem", height: "10rem" }}
            />
          ) : (
            <div
              className="bg-light rounded-circle align-self-center d-flex align-items-center p-3"
              style={{ width: "10rem", height: "10rem" }}>
              <MdPerson className="text-secondary" style={{ width: "10rem", height: "10rem" }} />
            </div>
          )}

          <div className="d-flex flex-column">
            <h1>{user.name}</h1>
            <h5>{`${user.points} points`}</h5>
            <h6>
              {`Member since ${new Intl.DateTimeFormat("en-GB").format(new Date(user.createdAt))}`}
            </h6>
          </div>
        </div>
        <Button
          variant="danger"
          className="flex-none fw-semibold"
          onClick={() => {
            sessionStorage.removeItem("JWT");
            navigate("/signin");
          }}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
