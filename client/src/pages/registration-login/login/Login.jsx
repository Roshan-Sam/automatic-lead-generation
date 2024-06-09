import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "flowbite-react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const handleChange = () => {};
  const handleSubmit = async () => {};
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex p-3 mx-auto max-w-screen-2xl flex-col xl:flex-row xl:items-center items-center gap-5">
        {/*left*/}
        <div className="flex-1 flex-grow relative border-gray-700 border rounded-lg overflow-hidden w-full flex items-center">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="absolute inset-0 object-cover"
          />
          <div className="relative z-10 p-6 bg-black bg-opacity-65">
            <Link to="/" className="font-bold text-white text-4xl w-auto">
              <span className="px-2 py-1 rounded-lg">
                Automatic Lead Generation
              </span>{" "}
              System
            </Link>
            <p className="text-white text-sm mt-5">
              This is a demo project. You can sign up with your email and
              password or with Google.
            </p>
          </div>
        </div>
        {/*right*/}
        <div className="flex-1 flex-grow">
          <div className="flex flex-col gap-4 max-w-lg">
            <div className="flex gap-10">
              <div className="w-full">
                <Label value="Username" />
                <input
                  type="text"
                  id="username"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                  placeholder="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <Label value="Password" />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                placeholder="•••••••••"
                required
              />
              {errors.password && (
                <p className="text-red-600 text-sm font-medium">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              type="button"
              className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-1  rounded-lg "
            >
              Sign in
            </button>
          </div>
          <div className="flex gap-2 text-sm mt-5">
            <span>Do not have an account?</span>
            <Link to="/register" className="text-purple-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
