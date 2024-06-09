import { useEffect, useState } from "react";
import { Label } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./registration.css";

const Register = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    sector: "",
  });
  const [errors, setErrors] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    sector: "",
  });
  const [companyUsers, setCompanyUsers] = useState([]);
  const navigate = useNavigate();

  const fetchCompanyUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}company/users/`
      );
      setCompanyUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanyUsers();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    validateField(id, value);
  };

  const validateField = (id, value) => {
    let errorMessage = "";

    switch (id) {
      case "company_name":
        if (!value.trim()) {
          errorMessage = "Company name is required";
        } else if (companyUsers.some((user) => user.company_name === value)) {
          errorMessage = "Company name already exists";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "Phone number must be 10 digits";
        } else if (companyUsers.some((user) => user.phone === value)) {
          errorMessage = "Phone number already exists";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Email is invalid";
        } else if (companyUsers.some((user) => user.email === value)) {
          errorMessage = "Email already exists";
        }
        break;

      case "username":
        if (!value.trim()) {
          errorMessage = "Username is required";
        } else if (companyUsers.some((user) => user.username === value)) {
          errorMessage = "Username already exists";
        }
        break;

      case "password":
        if (!value.trim()) {
          errorMessage = "Password is required";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters";
        }
        break;

      case "sector":
        if (!value) {
          errorMessage = "Sector is required";
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
      company_name: "",
      phone: "",
      email: "",
      username: "",
      password: "",
      sector: "",
    };

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required.";
      isValid = false;
    } else if (
      companyUsers.some((user) => user.company_name === formData.company_name)
    ) {
      newErrors.company_name = "Company name already exists";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    } else if (companyUsers.some((user) => user.phone === formData.phone)) {
      newErrors.phone = "Phone number already exists";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else if (companyUsers.some((user) => user.email === formData.email)) {
      newErrors.email = "Email already exists";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (
      companyUsers.some((user) => user.username === formData.username)
    ) {
      newErrors.username = "Username already exists";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.sector) {
      newErrors.sector = "Sector is required";
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
          `${import.meta.env.VITE_API_URL}register/company/`,
          formData
        );
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center">
      <div className="flex p-3 mx-auto max-w-screen-2xl flex-col xl:flex-row xl:items-center items-center gap-5">
        {/*left*/}
        <div className="flex-1 flex-grow relative border-gray-700 border rounded-lg overflow-hidden flex items-center w-full">
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
          <div className="flex flex-col gap-4 xl:max-w-lg">
            <div className="flex gap-10">
              <div className="w-80">
                <Label value="Company name" />
                <input
                  type="text"
                  id="company_name"
                  className=" bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                  placeholder="company name"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                />
                {errors.company_name && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div className="w-80">
                <Label value="Contact number" />
                <div className="flex items-center">
                  <button
                    id="phone-button"
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                  >
                    <svg
                      width="20"
                      height="15"
                      viewBox="0 0 20 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 me-2"
                    >
                      <rect width="20" height="5" fill="#FF7F00" />
                      <rect y="5" width="20" height="5" fill="#FFFFFF" />
                      <rect y="10" width="20" height="5" fill="#00B140" />
                      <circle cx="10" cy="7.5" r="1.5" fill="#0000FF" />
                      <circle cx="10" cy="7.5" r="1" fill="#FFFFFF" />
                      <path
                        d="M10 6.5V8.5M9.4 6.9L10.6 8.1M9.4 8.1L10.6 6.9"
                        stroke="#0000FF"
                        strokeWidth="0.2"
                      />
                    </svg>
                    +91
                  </button>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="phone"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-white rounded-e-lg border-s-0 border border-gray-300 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-600"
                      pattern="[0-9]{10}"
                      placeholder="mobile"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-10">
              <div className="w-80">
                <Label value="Email" />
                <input
                  type="email"
                  id="email"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                  placeholder="company.name@gmail.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="w-80">
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
            <div className="flex gap-10">
              <div className="w-80">
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
              <div className="w-80">
                <Label value="Select sector" />
                <select
                  id="sector"
                  data-hs-select='{
                  "placeholder": "Select option...",
                  "toggleTag": "<button type=\"button\"></button>",
                  "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-purple-600 focus:ring-purple-600 focus:ring-1 before:absolute before:inset-0 before:z-[1] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
                  "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                  "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-3.5 text-purple-600 dark:text-purple-600\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                  "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"flex-shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                }'
                  className="hidden"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a sector</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="energy">Energy</option>
                  <option value="consumer-goods">Consumer Goods</option>
                  <option value="utilities">Utilities</option>
                  <option value="industrials">Industrials</option>
                  <option value="telecom">Telecommunication</option>
                </select>
                {errors.sector && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.sector}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              type="button"
              className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-1  rounded-lg "
            >
              Sign up
            </button>
            <button
              type="button"
              class="justify-center px-4 py-2 border flex gap-2 border-gray-200 dark:border-gray-700 rounded-lg text-slate-700 dark:text-slate-200  dark:hover:border-gray-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
            >
              <img
                class="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
              />
              <span>Continue with Google</span>
            </button>
          </div>
          <div className="flex gap-2 text-sm mt-5 w-fit">
            <span>Have an account?</span>
            <Link to="/login" className="text-purple-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
