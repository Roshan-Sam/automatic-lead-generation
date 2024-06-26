import { useEffect, useState } from "react";
import { Label } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../../Functions/config";
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
  const [selectedLayout, setSelectedLayout] = useState("Sector");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [sectorOptions, setSectorOptions] = useState([
    "tech",
    "finance",
    "healthcare",
    "education",
    "real-estate",
    "energy",
    "consumer-goods",
    "utilities",
    "industrials",
    "telecom",
  ]);

  const showDropDownMenuOne_form_layout_wizard3 = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const swaptextone_form_layout_wizard3 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout(targetText);
    setDropdownVisible(false);
    if (e.target.innerText !== "Sector") {
      setFormData({ ...formData, sector: targetText });
    }
  };

  const handleOutsideClick = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard3"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard3"
    ) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const fetchCompanyUsers = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}companies/`);
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
          `${config.baseApiUrl}register/company/`,
          formData
        );
        if (res.status === 200) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="font-[sans-serif] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-[#333]">
        <div className="min-h-screen flex flex-col items-center justify-center lg:p-6 p-4">
          <div className="grid xl:grid-cols-2 items-center gap-10 max-w-6xl w-full">
            <div className="max-xl:text-center">
              <h2 className="text-4xl font-extrabold lg:leading-[50px] text-white">
                Automatic Lead Generation
              </h2>
              <p className="text-sm mt-6 text-white">
                This project combines automatic lead generation and social media
                marketing, making it easy to use and combined into one platform.
              </p>
              <p className="text-sm mt-10 text-white">
                Have an account?{" "}
                <Link
                  to="/login"
                  className="text-white font-semibold underline ml-1"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            <div className="">
              <div className="bg-white rounded-xl px-6 py-8 space-y-6 xl:max-w-lg md:max-w-2xl max-w-lg xl:ml-auto max-xl:mx-auto">
                <h3 className="text-3xl font-extrabold mb-12 max-xl:text-center">
                  Create Your Account
                </h3>
                <div className="xl:max-w-lg md:max-w-2xl max-w-lg flex flex-col gap-4">
                  <div className="flex md:gap-10 md:flex-row flex-col gap-2">
                    <div className="md:w-80">
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
                    <div className="md:w-80">
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
                  <div className="flex md:gap-10 md:flex-row flex-col gap-2">
                    <div className="md:w-80">
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
                    <div className="md:w-80">
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
                  <div className="flex md:gap-10 md:flex-row flex-col gap-2">
                    <div className="md:w-80">
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
                    <div className="md:w-80">
                      <Label value="Select sector" />
                      <div className="relative w-full border border-gray-300 rounded-lg outline-none dropdown-one">
                        <button
                          onClick={showDropDownMenuOne_form_layout_wizard3}
                          className="relative flex items-center justify-between w-full px-5 h-10 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                        >
                          <span
                            className="pr-4 text-sm text-gray-900"
                            id="drop-down-content-setter-one_form_layout_wizard3"
                          >
                            {selectedLayout}
                          </span>
                          <svg
                            id="rotate1"
                            className="absolute z-10 cursor-pointer right-5"
                            width={10}
                            height={6}
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.5 0.75L5 5.25L9.5 0.75"
                              stroke="#4B5563"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <div
                          className={`absolute right-0 z-20 ${
                            dropdownVisible ? "" : "hidden"
                          } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-10 max-h-28 overflow-y-scroll select`}
                          id="drop-down-div-one_form_layout_wizard3"
                        >
                          {sectorOptions.map((sector, index) => (
                            <a key={index}>
                              <p
                                className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                onClick={swaptextone_form_layout_wizard3}
                              >
                                {sector}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                      {errors.sector && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.sector}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="!mt-10">
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="w-full shadow-sm py-2.5 px-4 text-sm font-semibold rounded text-white bg-[#333] hover:bg-[#222] focus:outline-none"
                  >
                    Sign up
                  </button>
                  {success && (
                    <div
                      className="mt-2 bg-purple-100 border-t-2 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-100 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                              <path d="m9 12 2 2 4-4"></path>
                            </svg>
                          </span>
                        </div>
                        <div className="ms-3">
                          <h3 className="text-gray-800 font-semibold dark:text-white">
                            Successfully registered.
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-neutral-400">
                            You have successfully registered your account.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
      </div>
    </>
  );
};

export default Register;
