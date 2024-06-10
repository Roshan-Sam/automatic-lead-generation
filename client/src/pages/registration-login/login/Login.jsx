import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "flowbite-react";
import Cookies from "js-cookie";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [resErr, setResErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    validateField(id, value);
  };

  const validateField = (id, value) => {
    let errorMessage = "";

    switch (id) {
      case "username":
        if (!value.trim()) {
          errorMessage = "Username is required";
        }
        break;

      case "password":
        if (!value.trim()) {
          errorMessage = "Password is required";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}login/`,
          formData
        );
        if (res.status === 200) {
          const { token, user } = res.data;
          localStorage.setItem("user", JSON.stringify(user));
          Cookies.set("token", token, { expires: 7 });
          if (user.user_type === "admin") {
            navigate("/admin-dash");
          } else if (user.user_type === "company") {
            navigate("/company-dash");
          }
        }
      } catch (error) {
        setResErr(error.response.data.error);
        setTimeout(() => {
          setResErr("");
        }, 3000);
      }
    }
  };

  return (
    <>
      <div className="font-[sans-serif] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-[#333]">
        <div className="min-h-screen flex fle-col items-center justify-center lg:p-6 p-4">
          <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
            <div className="max-md:text-center">
              <h2 className="text-4xl font-extrabold lg:leading-[50px] text-white">
                Automatic Lead Generation
              </h2>
              <p className="text-sm mt-6 text-white">
                This project combines automatic lead generation and social media
                marketing, making it easy to use and combined into one platform.
              </p>
              <p className="text-sm mt-10 text-white">
                Do not have an account{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold underline ml-1"
                >
                  Register here
                </Link>
              </p>
            </div>
            <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto max-md:mx-auto w-full">
              <h3 className="text-3xl font-extrabold mb-12 max-md:text-center">
                Sign in Your Account
              </h3>
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
              <div className="w-full">
                <Label value="Password" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                  placeholder="•••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="text-sm text-right">
                <a className="text-purple-600 hover:underline cursor-pointer">
                  Forgot your password?
                </a>
              </div>
              {resErr && (
                <p className="text-red-600 text-sm font-medium text-center">
                  {resErr}
                </p>
              )}
              <div className="!mt-10">
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#333] hover:bg-[#222] focus:outline-none"
                >
                  Log in
                </button>
              </div>
              <p className="my-10 text-sm text-gray-400 text-center">
                or continue with
              </p>
              <div className="space-x-6 flex justify-center">
                <button
                  type="button"
                  className="border-none outline-none flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30px"
                    className="inline"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#fbbd00"
                      d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                      data-original="#fbbd00"
                    />
                    <path
                      fill="#0f9d58"
                      d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                      data-original="#0f9d58"
                    />
                    <path
                      fill="#31aa52"
                      d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                      data-original="#31aa52"
                    />
                    <path
                      fill="#3c79e6"
                      d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                      data-original="#3c79e6"
                    />
                    <path
                      fill="#cf2d48"
                      d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                      data-original="#cf2d48"
                    />
                    <path
                      fill="#eb4132"
                      d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                      data-original="#eb4132"
                    />
                  </svg>
                  <p>Google</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
