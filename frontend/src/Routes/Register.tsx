import { useId, useState } from "react";
import { Button } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Box from "../components/Box";

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
          <h1>Register</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-2">
              <label htmlFor={id + "-name"}>Name</label>
              <input
                {...register("name", { required: true })}
                id={id + "-name"}
                type={"text"}
                className="rounded-2 py-1 px-2"
              />
              {errors.name && <p className="text-danger mb-0">{errors.name.message}</p>}
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor={id + "-password"}>Password</label>
              <input
                {...register("password", { required: true })}
                id={id + "-password"}
                type={"password"}
                className="rounded-2 py-1 px-2"
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button type={"submit"} variant={"primary"} disabled={loading}>
                {!loading ? "Register" : "Loading..."}
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Register;
