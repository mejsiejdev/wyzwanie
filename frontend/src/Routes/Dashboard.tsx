import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import Box from "../components/Box";
import { Button } from "react-bootstrap";

type Challenge = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  completedAt?: Date;
  points: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<Challenge[]>();

  const getChallenges = async () => {
    setLoading(true);
    await fetch("http://localhost:8000/challenge", {
      method: "get",
      mode: "cors",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((challanges) => setChallenges(() => challanges));
    setLoading(false);
  };

  useEffect(() => {
    // Check if JWT exists in the storage
    if (sessionStorage.getItem("JWT") === null) {
      navigate("/signin");
    }
    // Fetch challenges
    getChallenges();
  }, []);
  return (
    <>
      <div className="d-flex flex-row align-items-center justify-content-between w-100">
        <h1>Dashboard</h1>
        <span className="rounded-circle bg-info" style={{ height: "2rem", width: "2rem" }} />
      </div>
      <div className="d-flex flex-column gap-3 w-100">
        {loading ? (
          <p>Loading challenges...</p>
        ) : challenges?.length !== 0 ? (
          challenges?.map((challenge, key) => <Challenge key={key} {...challenge} />)
        ) : (
          <Box>
            <div className="d-flex flex-row align-items-center justify-content-between gap-3">
              <p className="mb-0">Looks like you don&apos;t have any challenges yet!</p>
              <Link to={"/create"}>
                <Button variant={"primary"}>Create challange</Button>
              </Link>
            </div>
          </Box>
        )}
      </div>
    </>
  );
};

const Challenge = ({ content, expiresAt, completedAt }: Challenge) => (
  <Box>
    <div className="d-flex flex-row align-items-center justify-content-between gap-3">
      <h3>{content}</h3>
      <MdCheck style={{ fontSize: "2rem", flex: "none" }} />
    </div>
    <div>
      <p className="mb-0">
        Must be completed{" "}
        {new Intl.RelativeTimeFormat("en", { style: "long" }).format(
          Math.floor(
            (new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          ),
          "day",
        )}
      </p>
    </div>
  </Box>
);

export default Dashboard;
