import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, message, Space } from "antd";

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

  const [messageApi, contextHolder] = message.useMessage();

  const errorMsgFn = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/users/signup", data);
      console.log(response.data);
    } catch (error) {
      if (error.response.status === 400) {
        errorMsgFn(error.response.data.errors[0].message); // şimdilik böyle proje cesıtlendıkce array'i dönmek ıcın dusunuruz.
      }
    }
  };

  return (
    <>
      {contextHolder}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input {...register("email")} className="form-control" />
        </div>

        <div>
          <p>{errors.email?.message}</p>
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
          <p>{errors.password?.message}</p>
        </div>

        <button className="btn btn-primary">Sign Up</button>
      </form>
    </>
  );
};
