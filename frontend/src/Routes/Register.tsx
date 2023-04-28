import { useId, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MdPassword, MdPerson } from "react-icons/md";
import { toast } from "react-toastify";

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
          navigate("/photo");
          toast.success('Account created!');
        }
      });
    setLoading(false);
  };
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <div className="d-flex flex-column gap-3 w-100">
        <p className="fs-1 fw-semibold mb-0">Register</p>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
          <div className="d-flex flex-column">
            <label className="form-label d-flex gap-1 align-items-center" htmlFor={id + "-name"}>
              <MdPerson className="fs-5" />
              Username
            </label>
            <input
              {...register("name", { required: true })}
              id={id + "-name"}
              type={"text"}
              className="form-control rounded-2 py-1 px-2 mb-2 border border-none bg-light"
            />
            {errors.name && <p className="text-danger mb-2">{errors.name.message}</p>}
          </div>
          <div className="d-flex flex-column">
            <label
              className="form-label d-flex gap-1 align-items-center"
              htmlFor={id + "-password"}>
              <MdPassword className="fs-5" /> Password
            </label>
            <input
              {...register("password", { required: true })}
              id={id + "-password"}
              type={"password"}
              className="form-control rounded-2 py-1 px-2 mb-2 border border-none bg-light"
            />
          </div>
          <div className="container pt-2">
            <div className="row gap-3 align-items-center justify-content-between">
              <a
                className="mb-0 text-success order-last order-sm-first col-12 col-sm-auto text-center text-sm-left"
                href={"/signin"}>
                {" "}
                Already have an account?
              </a>
              <button
                type="submit"
                className="btn btn-success fw-semibold order-first order-sm-last col-12 col-sm-auto"
                disabled={loading}>
                {loading ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
