import { useState } from "react";
import Router from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useRequest from "../../hooks/use-request";

const schema = yup
  .object({
    email: yup.string().required().email(),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [bodyData, setBodyData] = useState();

  const { doRequest, contextHolder } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: bodyData,
    onSuccess: () => Router.push("/"), // en son bır hata cıkmassa
  });

  const onSubmit = async (data) => {
    setBodyData(data);

    doRequest();
  };

  return (
    <>
      {contextHolder}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input {...register("email")} className="form-control" />
        </div>

        <div>
          <p className="text=primary">{errors.email?.message}</p>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            {...register("password")}
            type="password"
            className="form-control"
          />
        </div>

        <div>
          <p className="text=danger">{errors.password?.message}</p>
        </div>

        <button className="btn btn-primary">Sign In</button>
      </form>
    </>
  );
};
