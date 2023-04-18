import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdCheck,
  MdOutlineNotifications,
  MdPerson,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import Box from "../components/Box";
import { Button, Overlay, Popover, Tooltip } from "react-bootstrap";
import useDebounce from "../hooks/useDebounce";

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
  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce<string>(filter, 500);

  const getChallenges = async () => {
    setLoading(true);
    await fetch(`http://localhost:8000/challenge?filter=${debouncedFilter}`, {
      method: "get",
      mode: "cors",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            navigate("/signin");
          }
          if (response.status === 500) {
            // TODO: Add some sort of error modal
            console.log("Something went horribly wrong...");
          }
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

  useEffect(() => {
    getChallenges();
  }, [debouncedFilter]);

  return (
    <div className="d-flex flex-column gap-3 w-100">
      <div className="d-flex flex-row align-items-center justify-content-between w-100">
        <h1>Dashboard</h1>
        <div className="d-flex align-items-center gap-3">
          <Notifications />
          <UserSection />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row gap-3">
          <div className="input-group px-0 col">
            <span className="input-group-text">
              <MdSearch className="fs-4 text-dark" />
            </span>
            <input
              title="Search for a challenge..."
              type="text"
              onChange={(e) => setFilter(e.target.value)}
              className="form-control"
              placeholder="Search for a challenge..."
            />
          </div>
          <Link to={"/create"} className="flex-shrink-0 col col-12 col-sm-auto px-0">
            <Button
              variant={"primary"}
              className="w-100 d-flex flex-row gap-1 align-items-center justify-content-center">
              <MdAdd className="fs-5" />
              <p className="mb-0">Create challenge</p>
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <p>Loading challenges...</p>
      ) : challenges?.length !== 0 ? (
        challenges?.map((challenge, key) => (
          <Challenge key={key} challenge={challenge} onClick={getChallenges} />
        ))
      ) : (
        filter == "" && (
          <Box>
            <div className="d-flex flex-row align-items-center justify-content-between gap-3">
              <p className="mb-0">Looks like you don&apos;t have any challenges yet!</p>
              <Link to={"/create"}>
                <Button variant={"primary"}>Create challenge</Button>
              </Link>
            </div>
          </Box>
        )
      )}
    </div>
  );
};

const Notifications = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] =
    useState<{ author: { name: string; photo: string }; id: string }[]>();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };

  const getNotifications = async () => {
    setLoading(true);
    await fetch("http://localhost:8000/user/notifications", {
      mode: "cors",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setNotifications(data));
    setLoading(false);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div ref={ref} className="d-flex flex-column align-items-center">
      <Button
        variant="unstyled"
        onClick={handleClick}
        title={show ? "Show notifications" : "Hide notifications"}>
        <MdOutlineNotifications className={`fs-3 ${show ? "text-primary" : "text-black"}`} />
      </Button>
      <Overlay show={show} target={target} placement="bottom" container={ref} containerPadding={16}>
        <Popover id="popover-contained">
          <Popover.Header as="h3">Notifications</Popover.Header>
          <Popover.Body>
            {notifications &&
              notifications.map(({ author, id }) => (
                <Link
                  to={`/check/${id}`}
                  className="d-flex gap-3 align-items-center text-decoration-none text-black">
                  <img src={author.photo} alt={author.name} className="rounded-circle" width="48" />
                  <div>
                    <strong>{author.name}</strong> wants you to approve their challenge.
                  </div>
                </Link>
              ))}
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
};

const UserSection = () => {
  const [show, setShow] = useState<boolean>(false);
  const target = useRef(null);
  const [data, setData] = useState<{ name: string; photo: string }>();
  useEffect(() => {
    fetch("http://localhost:8000/user/photo", {
      method: "GET",
      headers: {
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 500) {
          // TODO: Add some sort of error modal
          console.log("Something went horribly wrong...");
        }
      })
      .then((data) => setData(data));
  }, []);
  return !data ? (
    <p>Loading...</p>
  ) : (
    <Link to={`/${data.name}`}>
      {data.photo != null ? (
        <img
          ref={target}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          alt={data.name}
          src={data.photo}
          className="rounded-circle object-fit-cover"
          height={48}
          width={48}
        />
      ) : (
        <div
          ref={target}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="bg-light rounded-circle align-self-center d-flex align-items-center"
          style={{ width: "48", height: "48" }}>
          <MdPerson className="text-secondary" style={{ width: "42", height: "42" }} />
        </div>
      )}

      <Overlay target={target.current} show={show} placement="bottom">
        {(props) => <Tooltip {...props}>{data.name}</Tooltip>}
      </Overlay>
    </Link>
  );
};

const Challenge = ({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const setAsCompleted = async () => {
    setLoading(true);
    await fetch("http://localhost:8000/challenge", {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
      body: JSON.stringify({
        id: challenge.id,
      }),
    }).then((response) => {
      setLoading(false);
      if (response.ok) {
        console.log(response.statusText);
        onClick();
      }
    });
  };
  return (
    <Box>
      <div className="d-flex flex-row align-items-center justify-content-between gap-3">
        <h3>{challenge.content}</h3>
        <Button
          // @ts-ignore
          disabled={loading || challenge.completedAt}
          title="Mark as completed"
          onClick={!challenge.completedAt ? setAsCompleted : undefined}
          variant={challenge.completedAt ? "success" : "unstyled"}>
          {!loading ? (
            <MdCheck style={{ fontSize: "2rem", flex: "none" }} />
          ) : (
            <MdRefresh style={{ fontSize: "2rem", flex: "none" }} />
          )}
        </Button>
      </div>
      <div>
        <p className="mb-0">
          Must be completed{" "}
          {new Intl.RelativeTimeFormat("en", { style: "long" }).format(
            Math.floor(
              (new Date(challenge.expiresAt).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            ),
            "day",
          )}
        </p>
      </div>
    </Box>
  );
};

export default Dashboard;
