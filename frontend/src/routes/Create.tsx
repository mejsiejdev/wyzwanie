import { useId } from "react";
import { Button } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "../components/Box";
import { useNavigate } from "react-router-dom";
import { MdTextsms, MdDateRange } from "react-icons/md";
import { AiFillStar, AiOutlineUser } from "react-icons/ai";
type Inputs = {
  content: string;
  expiresAt: Date;
  points: number;
  checker: string;
};

const Create = () => {
  const navigate = useNavigate();
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    console.log(sessionStorage.getItem("JWT"));
    fetch("http://localhost:8000/challenge", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) navigate("/");
      // TODO: Handle the case when the challenge creation fails.
    });
  };
  const nextDay = new Date();
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <Box>
        <div className="d-flex flex-column align-items-center gap-3 w-100">
          <p className="fs-1 fw-semibold mb-0">Create a task</p>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 w-100 p-3">
            <div className="d-flex flex-column gap-2">
              <label htmlFor={id + "-content"} className="form-label gap-1 items-center">
                <MdTextsms /> Content
              </label>
              <textarea
                {...register("content", { required: true })}
                id={id + "-content"}
                className="form-control bg-light rounded-2 py-1 px-2"
              />
            </div>
            <div className="d-flex flex-row gap-2 align-items-center w-100">
              <div className="d-flex flex-column gap-2">
                <label className="form-label gap-1 items-center" htmlFor={id + "-expiresAt"}>
                  <MdDateRange /> Expiration date
                </label>
                <input
                  {...register("expiresAt", { required: true })}
                  id={id + "-expiresAt"}
                  type={"datetime-local"}
                  defaultValue={nextDay
                    .toISOString()
                    .slice(0, nextDay.toISOString().lastIndexOf(":"))}
                  className="rounded-2 form-control"
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <label className="form-label gap-1 items-center" htmlFor={id + "-points"}><AiFillStar/> Points</label>
                <input
                  {...register("points", { required: true })}
                  id={id + "-points"}
                  type={"number"}
                  min={0}
                  step={5}
                  max={100}
                  className="rounded-2 form-control"
                />
              </div>
            </div>
            <div className="d-flex flex-column gap-2">
              <label className="form-label gap-1 items-center" id={id + '-checker'}>
              <AiOutlineUser /> Checker
              </label>
              <select
                className="form-control mb-3"
                id={id + "-checker"}
                {...register("checker", { required: true })}>
                <option selected disabled>
                  values will go here
                </option>
              </select>
            </div>
            <div className="d-flex justify-content-end pt-1">
              <Button type={"submit"} variant={"primary"}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Create;
