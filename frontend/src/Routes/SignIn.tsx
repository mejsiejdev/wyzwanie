import { useId, useState } from "react";
import { MdPerson2, MdPassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Box from "../components/Box/Box";

type Inputs = {
  name: String;
  password: String;
};

export default function SignIn() {
  const id = useId();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    await fetch("http://localhost:8000/user/signin", {
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
          setError("name", { type: "value", message: "Wrong user credentials ❗❗❗❗" });
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
        <p className="fs-1 text-center fw-bold">Sign in</p>
        <form className="p-3" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label gap-1 items-center" htmlFor={id + "-name"}>
              <MdPerson2 /> Username
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              className="form-control bg-opacity-50"
              id={id + "-name"}
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              name="name"
            />
            {errors.name && <p className="text-danger mb-0">{errors.name.message}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label gap-1 items-center" htmlFor={id + "-password"}>
              <MdPassword /> Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              id={id + "-password"}
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              className="form-control"
            />
            {errors.name && <p className="text-danger mb-0">{errors.name.message}</p>}
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <a className="mb-0 text-success" href={"/register"}>
              {" "}
              Don't have an account?
            </a>
            <button type="submit" className="btn btn-success fw-semibold" disabled={loading}>
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </form>
      </Box>
    </div>
  );
}
