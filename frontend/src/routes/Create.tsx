import { useId } from "react";
import { Button } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import {
  MdArrowBackIosNew,
  MdDateRange,
  MdPersonSearch,
  MdStarRate,
  MdTextsms,
} from "react-icons/md";

type Inputs = {
  content: string;
  expiresAt: number;
  points: number;
  checker: string;
};

export const loader = async () => {
  try {
    const response = await fetch("http://localhost:8000/user/checker", {
      mode: "cors",
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

const Create = () => {
  const navigate = useNavigate();
  const checkers = useLoaderData() as { name: string; photo: string }[];
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Get current date
    const date = new Date();
    date.setDate(date.getDate() + parseInt(data.expiresAt.toString()));

    fetch("http://localhost:8000/challenge", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("JWT")}`,
      },
      body: JSON.stringify({
        content: data.content,
        expiresAt: date,
        points: data.points,
        checker: data.checker !== "Select a checker" ? data.checker : undefined,
      }),
    }).then((response) => {
      if (response.ok) navigate("/");
      else {
        setError("content", { type: "value", message: "Internal server error." });
        reset({}, { keepErrors: true, keepValues: true });
      }
    });
  };
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <div className="d-flex flex-column align-items-start gap-3 w-100">
        <div className="d-flex gap-3 align-items-center">
          <Link to="/" className="text-black">
            <MdArrowBackIosNew className="fs-3 mb-1" />
          </Link>
          <h1>Create challenge</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 w-100">
          <div className="d-flex flex-column">
            <label htmlFor={id + "-content"} className="form-label d-flex gap-1 align-items-center">
              <MdTextsms /> Content
            </label>
            <textarea
              {...register("content", { required: true })}
              id={id + "-content"}
              className="form-control bg-light rounded-2 py-1 px-2"
            />
            {errors.content && <p className="text-danger mb-2">{errors.content.message}</p>}
          </div>
          <div className="d-flex flex-row gap-3 align-items-center w-100">
            <div className="d-flex flex-column w-100">
              <label
                htmlFor={id + "-expiresAt"}
                className="form-label d-flex gap-1 align-items-center">
                <MdDateRange />
                Due Date
              </label>
              <select
                {...register("expiresAt", { required: true })}
                id={id + "-expiresAt"}
                className="form-select bg-light rounded-2 py-1 px-2">
                <option selected value={1}>
                  A day from now
                </option>
                <option value={7}>A week from now</option>
                <option value={31}>A month from now</option>
                <option value={182}>6 months from now</option>
                <option value={365}>A year from now</option>
              </select>
            </div>
            <div className="d-flex flex-column">
              <label
                htmlFor={id + "-points"}
                className="form-label d-flex gap-1 align-items-center">
                <MdStarRate /> Points
              </label>
              <input
                {...register("points", { required: true })}
                id={id + "-points"}
                type={"number"}
                min={0}
                step={5}
                max={100}
                className="form-control bg-light rounded-2 py-1 px-2"
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <label htmlFor={id + "-checker"} className="form-label d-flex gap-1 align-items-center">
              <MdPersonSearch />
              Checker
            </label>
            <select {...register("checker", { required: false })} className="form-select bg-light">
              <option disabled selected value={undefined}>
                Select a checker
              </option>
              {checkers &&
                checkers.map(({ name }, key) => (
                  <option value={name} key={key}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
          <div className="d-flex justify-content-end pt-1">
            <Button type={"submit"} variant={"primary"} className="fw-semibold w-100">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
