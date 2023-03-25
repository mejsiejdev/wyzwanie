import { useId } from "react";
import Container from "react-bootstrap/Container";
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: String;
  password: String;
};

export default function SignIn() {
  const id = useId();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit:SubmitHandler<Inputs> = async (data) => {

  }

  return (
    <Container className="p-3 min-vh-100 bg-opacity-25 d-flex justify-content-center align-items-center">
      <div className="row p-3 m-10 d-flex justify-content-center align-items fw-semibold rounded-4 bg-light border border-opacity-25 border-success">
        <p className="fs-1 text-center fw-bold">Sign in</p>
        <form className="p-3" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label gap-1 items-center" htmlFor={id + "-name"}>
              <AiOutlineUser /> Username
            </label>
            <input
              {...register("name", {required: true})}
              type="text"
              className="form-control bg-opacity-50"
              id={id + "-name"}
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              name="name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label gap-1 items-center" htmlFor={id + "-password"}>
              <RiLockPasswordFill /> Password
            </label>
            <input
            {...register("password", {required: true})}
              type="password"
              id={id + "-password"}
              style={{ backgroundColor: "rgb(213, 235, 214)" }}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success fw-semibold">
            sign in
          </button>
        </form>
      </div>
    </Container>
  );
}
