import { MdClose, MdPerson } from "react-icons/md";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import moment from "moment";
import type Challenge from "../types/Challenge";
import type User from "../types/User";
import { toast } from "react-toastify";

export const loader = async ({ params }: { params: { id: string } }) => {
  try {
    const response = await fetch(`http://localhost:8000/challenge/${params.id}`, {
      mode: "cors",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    });
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data;
  } catch {
    throw new Response(null, { status: 500, statusText: "Internal Server Error" });
  }
};

const Check = () => {
  const navigate = useNavigate();

  // Get the data
  const { challenge, author } = useLoaderData() as { challenge: Challenge; author: User };
  const check = async (approved: boolean) => {
    await fetch("http://localhost:8000/challenge/check", {
      method: "PUT",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: challenge.id,
        approved: approved,
      }),
    }).then((response) => {
      if (response.ok){
        navigate('/');
        toast.success('Task approved!');
      } else if (response.status === 401){
        navigate('/signin');
      } else if(response.status === 500){
        console.log('Internal server error, please try again later');
      }
    });
  };
  return (
    <div className="fixed-top min-vh-100 w-100" style={{ zIndex: 1080 }}>
      <div className="position-absolute w-100 bg-dark opacity-25 min-vh-100" />
      <div className="position-absolute w-100 min-vh-100 d-flex align-items-center p-3 justify-content-center">
        <div className="rounded shadow">
          <div className="bg-white d-flex flex-column gap-3 rounded-top p-3">
            <div className="d-flex flex-row gap-5 align-items-start justify-content-between">
              <div className="d-flex flex-column gap-1">
                <h2 className="mb-0">Check challenge</h2>
                <h6 className="mb-0 text-secondary">
                  Decide whether you approve the completion of the challenge below.
                </h6>
              </div>
              <Link to="/">
                <MdClose className="fs-1 text-black" />
              </Link>
            </div>
            <div className="d-flex flex-column gap-2 shadow-sm p-3 border rounded my-1">
              <h2 className="mb-0">{challenge.content}</h2>
              <div className="d-flex align-items-center gap-2">
                {author.photo != null ? (
                  <img
                    alt={author.name}
                    src={author.photo}
                    className="rounded-circle object-fit-cover"
                    height={36}
                    width={36}
                  />
                ) : (
                  <div
                    className="bg-light rounded-circle align-self-center d-flex align-items-center"
                    style={{ width: "36", height: "36" }}>
                    <MdPerson className="text-secondary" style={{ width: "30", height: "30" }} />
                  </div>
                )}
                <p className="mb-0">{author.name}</p>
              </div>
              <p className="mb-0">{`Completed on ${moment(challenge.createdAt).format(
                "MMM Do, h:mm a",
              )}`}</p>
            </div>
          </div>
          <div className="d-flex flex-column gap-3 bg-light p-3 rounded-bottom border-top">
            <h5 className="mb-0">Do you approve it?</h5>
            <div className="container">
              <div className="row gap-2">
                <button
                  onClick={() => check(true)}
                  className="col order-last btn btn-success w-100 fw-semibold">
                  Yes
                </button>
                <button
                  onClick={() => check(false)}
                  className="col order-first btn btn-danger fw-semibold w-100">
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Check;
