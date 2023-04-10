import { MdArrowBackIosNew } from "react-icons/md";
import { Link, useLoaderData } from "react-router-dom";

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
  const user = useLoaderData() as {
    id: string;
    name: string;
    password: string;
    photo: string | null;
    points: number;
    createdAt: Date;
    updatedAt: Date;
  };
  return (
    <div className="d-flex flex-column gap-3 w-100">
      <Link to="/">
        <MdArrowBackIosNew className="fs-3 my-3" />
      </Link>
      <div className="d-flex flex-column flex-sm-row gap-4 gap-sm-5 align-items-center w-100">
        {user.photo !== null && (
          <img
            src={user.photo}
            alt={user.name}
            className="rounded-circle w-100"
            style={{ maxWidth: "12rem" }}
          />
        )}
        <div className="d-flex flex-column w-100">
          <h1>{user.name}</h1>
          <h5>{`${user.points} points`}</h5>
          <h6>{`Member since ${new Intl.DateTimeFormat("en-GB").format(
            new Date(user.createdAt),
          )}`}</h6>
        </div>
      </div>
    </div>
  );
};

export default Profile;
