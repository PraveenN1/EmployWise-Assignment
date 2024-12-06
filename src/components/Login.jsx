import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { AiOutlineMail } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(""); 
    try {
      const response = await login(data);
      authLogin(response.data.token);
      window.alert('Successful Login!');
      // toast.success('Successful Login!');
      setTimeOut(() => {
        navigate("/users");
      }, 5000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setApiError("Invalid email or password. Please try again.");
      } else {
        setApiError("Something went wrong. Please try later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 rounded shadow-lg bg-slate-50 max-w-sm w-full"
      >
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>

        <div className="relative mb-4">
          <AiOutlineMail className="absolute left-3 top-3 text-gray-500" />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            type="email"
            placeholder="Email"
            className="border w-full pl-10 py-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative mb-4">
          <TbLockPassword className="absolute left-3 top-3 text-gray-500" />
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border w-full pl-10 py-2 rounded"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>

        {apiError && (
          <p className="text-red-500 text-sm mt-2 text-center">{apiError}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
