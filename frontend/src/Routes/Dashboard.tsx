import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheck } from "react-icons/md";
import Box from "../components/Box";

const Dashboard = () => {
  const navigate = useNavigate();
  console.log(sessionStorage.getItem("JWT") === null);
  useEffect(() => {
    if (sessionStorage.getItem("JWT") === null) {
      navigate("/signin");
    }
    // fetch data here
  }, []);
  return (
    <>
      <div className="d-flex flex-row align-items-center justify-content-between w-100">
        <h1>Dashboard</h1>
        <span className="rounded-circle bg-info" style={{ height: "2rem", width: "2rem" }} />
      </div>
      <div className="d-flex flex-column gap-3 w-100">
        <Challange
          content="Complete making the dashboard"
          expiresAt={"2023-03-25T00:00:00Z"}
          completedAt={""}
        />
        <Challange
          content="Clean up the backend"
          expiresAt={"2023-04-23T00:00:00Z"}
          completedAt={""}
        />
      </div>
    </>
  );
};

const Challange = ({
  content,
  expiresAt,
  completedAt,
}: {
  content: string;
  expiresAt: string;
  completedAt: string;
}) => (
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
