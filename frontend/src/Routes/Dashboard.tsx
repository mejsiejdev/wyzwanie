import { MdCheck } from "react-icons/md";

const Dashboard = () => {
  return (
    <div className="d-flex w-100 min-vh-100 p-4 bg-light">
      <div className="d-flex w-100 container flex-column gap-3">
        <div className="d-flex flex-row align-items-center justify-content-between w-100">
          <h1>Dashboard</h1>
          <span className="rounded-circle bg-info" style={{ height: "2rem", width: "2rem" }} />
        </div>
        <div className="d-flex flex-column gap-3">
          <Task
            content="Complete making the dashboard"
            expiresAt={"2023-03-25T00:00:00Z"}
            completedAt={""}
          />
          <Task
            content="Clean up the backend"
            expiresAt={"2023-04-23T00:00:00Z"}
            completedAt={""}
          />
        </div>
      </div>
    </div>
  );
};

const Task = ({
  content,
  expiresAt,
  completedAt,
}: {
  content: string;
  expiresAt: string;
  completedAt: string;
}) => (
  <div className="shadow-sm p-3 border border-light rounded-3 bg-white">
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
  </div>
);

export default Dashboard;
