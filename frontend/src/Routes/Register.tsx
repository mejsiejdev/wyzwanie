import { useId, useState } from "react";
import { Button } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Box from "../components/Box";
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";

type Inputs = {
  name: string;
  password: string;
};

const Register = () => {
  const id = useId();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    await fetch("http://localhost:8000/user", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setError("name", { type: "value", message: "Account with this name already exists." });
          reset({}, { keepErrors: true, keepValues: true });
        }
      })
      .then((data) => {
        if (data) {
          sessionStorage.setItem("JWT", data);
          navigate("/");
        }
      });
    setLoading(false);
  };
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <Box>
        <div className="d-flex flex-column gap-3 w-100">
          <p className="fs-1 text-center fw-bold">Register</p>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column p-3">
            <div className="d-flex flex-column">
              <label className="form-label gap-1 items-center" htmlFor={id + "-name"}>
                <AiOutlineUser /> Username
              </label>
              <input
                {...register("name", { required: true })}
                id={id + "-name"}
                type={"text"}
                className="form-control rounded-2 py-1 px-2 mb-3 border border-none"
                style={{ backgroundColor: "rgb(213, 235, 214)" }}
              />
              {errors.name && <p className="text-danger mb-0">{errors.name.message}</p>}
            </div>
            <div className="d-flex flex-column">
              <label className="form-label gap-1 items-center" htmlFor={id + "-password"}>
                <RiLockPasswordFill /> Password
              </label>
              <input
                {...register("password", { required: true })}
                id={id + "-password"}
                type={"password"}
                style={{ backgroundColor: "rgb(213, 235, 214)" }}
                className="form-control rounded-2 py-1 px-2 mb-3 border border-none"
              />
            </div>
            <div className="d-flex flex-row align-items-center justify-content-between">
              <a className="mb-0 text-success" href={"/signin"}>
                {" "}
                Already have an account?
              </a>
              <button type="submit" className="btn btn-success fw-semibold" disabled={loading}>
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Register;
