import { useId } from "react";
import { Button } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import Box from "../components/Box";

type Inputs = {
  name: string;
  password: string;
};

const Create = () => {
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    fetch("http://localhost:8000/user", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ maxWidth: "28rem" }}>
      <Box>
        <div className="d-flex flex-column align-items-center gap-3 w-100">
          <h1>Create new task</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 w-100">
            <div className="d-flex flex-column gap-2">
              <label htmlFor={id + "-name"}>Name</label>
              <input
                {...register("name")}
                id={id + "-name"}
                type={"text"}
                className="rounded-2 py-1 px-2"
              />
            </div>
            <div className="d-flex flex-column gap-2">
              <label htmlFor={id + "-password"}>Password</label>
              <input
                {...register("password")}
                id={id + "-password"}
                type={"password"}
                className="rounded-2 py-1 px-2"
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button type={"submit"} variant={"primary"}>
                Register
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default Create;
