import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

  const onSubmit = async (data) => {
    const response = await axios.post("/api/users/signup", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input {...register("email")} className="form-control" />
      </div>
      <div>{errors.email?.message}</div>
      <div className="form-group">
        <label>Password</label>
        <input
          {...register("password")}
          type="password"
          className="form-control"
        />
      </div>
      <div>{errors.password?.message}</div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
