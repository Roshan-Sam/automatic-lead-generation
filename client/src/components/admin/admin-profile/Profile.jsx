import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import { useAdminProfileContext } from "../../../hooks/useAdminProfileContext";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { profile, dispatch } = useAdminProfileContext();
  const location = useLocation();
  const passwordResetRef = useRef(null);

  const [formData, setFormData] = useState({
    company_name: profile.company_name || "",
    email: profile.email || "",
    username: profile.username || "",
    phone: profile.phone || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessage1, setSuccessMessage1] = useState("");
  const [successMessage2, setSuccessMessage2] = useState("");

  const [errors, setErrors] = useState({
    current_password: "",
    new_password: "",
  });
  const [errors1, setErrors1] = useState({});

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const passFromUrl = urlParams.get("password");
    if (passFromUrl === "reset") {
      passwordResetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    setFormData({
      company_name: profile.company_name,
      email: profile.email,
      username: profile.username,
      phone: profile.phone,
    });
  }, [profile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    if (profileImage) {
      formDataToSubmit.append("profile", profileImage);
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}admin/update-profile/${profile.id}/`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        dispatch({ type: "UPDATE_PROFILE", payload: res.data });
        setSuccessMessage("Profile updated successfully.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    if (profileImage) {
      formDataToSubmit.append("profile", profileImage);
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}admin/update-profile/${profile.id}/`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        dispatch({ type: "UPDATE_PROFILE", payload: res.data });
        setSuccessMessage1("Image updated successfully.");
        setTimeout(() => setSuccessMessage1(""), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [id]: value });
    validatePasswordField(id, value);
  };

  const validatePasswordField = (id, value) => {
    let errorMessage = "";
    if (value.length < 6) {
      errorMessage = "Password must be at least 6 characters";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}admin/update-password/${profile.id}/`,
        passwordFormData
      );
      if (res.status === 200) {
        setSuccessMessage2("Password updated successfully.");
        setPasswordFormData({ current_password: "", new_password: "" });
        setTimeout(() => {
          setSuccessMessage2("");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrors1({ ...errors1, password_error: error.response.data.error });
        setTimeout(() => {
          setErrors1({});
        }, 3000);
      }
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex pt-10 px-4 mb-12">
        <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
          <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
            <Link to="/admin-dash?tab=dash">Dashboard</Link>
          </li>
          <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
            <Link to="/admin-dash?tab=account">Profile</Link>
          </li>
        </ul>
      </div>
      <div className="px-4">
        <div className="text-white bg-slate-900 py-10 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="order-2 lg:order-1 md:col-span-2 bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-700">
              <h1 className="text-3xl mb-6">Personal Information</h1>
              <div>
                <div>
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-white"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    className="mt-1 block w-full bg-transparent rounded-md border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-transparent shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-transparent shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-transparent shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="register_date"
                    className="block text-sm font-medium text-white"
                  >
                    Account Registered On
                  </label>
                  <input
                    type="text"
                    id="register_date"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={new Date(profile.register_date).toLocaleDateString()}
                    readOnly
                  />
                </div>
                {successMessage && (
                  <div
                    className="mt-3 bg-purple-100 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-200 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                          <FiCheckCircle
                            size={24}
                            stroke="currentColor"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Profile Update.
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                          {successMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-700">
              <h2 className="text-xl mb-6">Your Photo</h2>
              <div className="flex flex-col items-center">
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : `${import.meta.env.VITE_API_IMAGE_URL}${
                          profile.profile
                        }`
                  }
                  alt={profile.username}
                />
                <div className="mt-4">
                  <label
                    htmlFor="profile"
                    className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <MdEdit className="inline-block mr-2" /> Edit your photo
                  </label>
                  <input
                    type="file"
                    id="profile"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleProfileSubmit}
                    type="button"
                    className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    Save image
                  </button>
                </div>
              </div>
              {successMessage1 && (
                <div
                  className="mt-3 bg-purple-100 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-200 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                        <FiCheckCircle
                          size={24}
                          stroke="currentColor"
                          strokeWidth={2}
                        />
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Image Update.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {successMessage1}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            ref={passwordResetRef}
            className="mt-6 p-6 border border-slate-700 rounded-md"
          >
            <h1 className="text-2xl mb-6">Password Reset</h1>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mt-6">
                <label
                  htmlFor="current_password"
                  className="block text-sm font-medium text-white"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="current_password"
                  className="mt-1 block w-full rounded-md border-gray-700 bg-transparent shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  value={passwordFormData.current_password}
                  onChange={handlePasswordChange}
                />
                {errors.current_password && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.current_password}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  className="mt-1 block w-full rounded-md border-gray-700 bg-transparent shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  value={passwordFormData.new_password}
                  onChange={handlePasswordChange}
                />
                {errors.new_password && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.new_password}
                  </p>
                )}
              </div>
              {errors1 && errors1.password_error && (
                <div
                  className="bg-red-100 border-s-4 border-red-600 p-4 dark:bg-red-800/30 mt-3"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                        <FiX size={24} stroke="currentColor" strokeWidth={2} />
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Password Reset.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {errors1.password_error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {successMessage2 && (
                <div
                  className="mt-3 bg-purple-100 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                  role="alert"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-200 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                        <FiCheckCircle
                          size={24}
                          stroke="currentColor"
                          strokeWidth={2}
                        />
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Password Reset.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {successMessage2}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
