import { useState, useEffect } from "react";
import {
  MdAdd,
  MdClose,
  MdAttachMoney,
  MdOutlineAddCircle,
} from "react-icons/md";
import {
  FaEdit,
  FaSync,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import "./planprice.css";

const PlanAndPricing = () => {
  const [plans, setPlans] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [planAndPricingForm, setPlanAndPricingForm] = useState({
    plan_name: "",
    description: "",
    features: "",
    monthly_price: "",
    annual_price: "",
    custom_price: "",
    duration_in_months: "",
  });

  const [editPlanPricingForm, setEditPlanPricingForm] = useState({
    plan_name: "",
    description: "",
    features: "",
    monthly_price: "",
    annual_price: "",
    custom_price: "",
    duration_in_months: "",
  });

  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const onOpenEditModal = () => setOpenEditModal(true);
  const onCloseEditModal = () => setOpenEditModal(false);
  const [editPlan, setEditPlan] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onOpenDeleteModal = () => setOpenDeleteModal(true);
  const onCloseDeleteModal = () => setOpenDeleteModal(false);
  const [deletePlanId, setDeletePlanId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!openModal) {
      setErrors({});
      setPlanAndPricingForm({
        plan_name: "",
        description: "",
        features: "",
        monthly_price: "",
        annual_price: "",
        custom_price: "",
        duration_in_months: "",
      });
    }
  }, [openModal]);

  useEffect(() => {
    if (!openEditModal) {
      setEditErrors({});
      setEditPlan(null);
      setEditPlanPricingForm({
        plan_name: "",
        description: "",
        features: "",
        monthly_price: "",
        annual_price: "",
        custom_price: "",
        duration_in_months: "",
      });
    }
  }, [openEditModal]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}admin/create-subscription-plan/`
      );
      if (res.status === 200) {
        setPlans(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPlanAndPricingForm({ ...planAndPricingForm, [id]: value });

    validateField(id, value);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditPlanPricingForm({ ...editPlanPricingForm, [id]: value });
    validateEditField(id, value);
  };

  const validateField = (id, value) => {
    let errorMessage = "";

    switch (id) {
      case "plan_name":
        if (!value.trim()) {
          errorMessage = "Plan name is required";
        } else if (
          plans.some(
            (plan) =>
              plan.plan_name.toLowerCase() === value.trim().toLowerCase()
          )
        ) {
          errorMessage = "Plan name already exists";
        }
        break;
      case "description":
        if (value.trim() === "") {
          errorMessage = "Description is required";
        }
        break;
      case "features":
        if (value.trim() === "") {
          errorMessage = "Features are required";
        }
        break;
      case "monthly_price":
        if (value.trim() === "") {
          errorMessage = "Monthly price is required";
        }
        break;
      case "annual_price":
        if (value.trim() === "") {
          errorMessage = "Annual price is required";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const validateEditField = (id, value) => {
    let errorMessage = "";

    switch (id) {
      case "plan_name":
        if (!value.trim()) {
          errorMessage = "Plan name is required";
        } else if (
          plans.some(
            (plan) =>
              plan.plan_name.toLowerCase() === value.trim().toLowerCase() &&
              plan.id !== editPlan.id
          )
        ) {
          errorMessage = "Plan name already exists";
        }
        break;
      case "description":
        if (value.trim() === "") {
          errorMessage = "Description is required";
        }
        break;
      case "features":
        if (value.trim() === "") {
          errorMessage = "Features are required";
        }
        break;
      case "monthly_price":
        if (value.trim() === "") {
          errorMessage = "Monthly price is required";
        }
        break;
      case "annual_price":
        if (value.trim() === "") {
          errorMessage = "Annual price is required";
        }
        break;
      default:
        break;
    }

    setEditErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(planAndPricingForm).forEach((field) => {
      if (field !== "custom_price" && field !== "duration_in_months") {
        const value = planAndPricingForm[field].trim();
        if (value === "") {
          isValid = false;
          const fieldName = field.replace(/_/g, " ");
          const errorMessage = `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`;
          newErrors[field] = errorMessage;
        }
      }
    });

    if (planAndPricingForm.features.trim() === "") {
      isValid = false;
      newErrors.features = "Features are required";
    }

    if (
      plans.some(
        (plan) =>
          plan.plan_name.toLowerCase() ===
          planAndPricingForm.plan_name.trim().toLowerCase()
      )
    ) {
      isValid = false;
      newErrors.plan_name = "Plan name already exists";
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateEditForm = () => {
    let isValid = true;
    const newEditErrors = {};

    Object.keys(editPlanPricingForm).forEach((field) => {
      if (field !== "custom_price" && field !== "duration_in_months") {
        const value = editPlanPricingForm[field].trim();
        if (value === "") {
          isValid = false;
          const fieldName = field.replace(/_/g, " ");
          const errorMessage = `${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          } is required`;
          newEditErrors[field] = errorMessage;
        }
      }
    });

    if (editPlanPricingForm.features.trim() === "") {
      isValid = false;
      newEditErrors.features = "Features are required";
    }

    if (
      plans.some(
        (plan) =>
          plan.plan_name.toLowerCase() ===
            editPlanPricingForm.plan_name.trim().toLowerCase() &&
          plan.id !== editPlan.id
      )
    ) {
      isValid = false;
      newEditErrors.plan_name = "Plan name already exists";
    }

    setEditErrors(newEditErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}admin/create-subscription-plan/`,
        planAndPricingForm
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setPlans([...plans, res.data.data]);
        setTimeout(() => {
          setSuccess("");
          onCloseModal();
        }, [3000]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}admin/update-subscription-plan/${
          editPlan.id
        }/`,
        editPlanPricingForm
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setPlans((prevPlans) => {
          return prevPlans.map((plan) =>
            plan.id === editPlan.id ? res.data.data : plan
          );
        });
        setTimeout(() => {
          setSuccess("");
          onCloseEditModal();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (plan) => {
    setEditPlan(plan);
    setEditPlanPricingForm({
      plan_name: plan.plan_name,
      description: plan.description,
      features: plan.features,
      monthly_price: plan.monthly_price,
      annual_price: plan.annual_price,
      custom_price: plan.custom_price,
      duration_in_months: plan.duration_in_months,
    });
    onOpenEditModal();
  };

  const handleDelete = (planId) => {
    onOpenDeleteModal();
    setDeletePlanId(planId);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }admin/update-subscription-plan/${deletePlanId}/`
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setPlans((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== deletePlanId)
        );
        setTimeout(() => {
          setSuccess("");
          setDeletePlanId(null);
          onCloseDeleteModal();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      <div className="text-white py-10 px-4">
        <div className="px-4">
          <h1 className="text-3xl font-bold text-center mb-12">
            Pricing and Plans
          </h1>

          <div className="flex mb-8 justify-end">
            <button
              onClick={onOpenModal}
              className="py-2 w-36 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-slate-950 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              <MdAdd className="flex-shrink-0 size-5" />
              Add New Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                key={plan.id}
                className="bg-slate-900 p-6 rounded-lg border border-gray-700 shadow-sm shadow-gray-500 transition-shadow duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-6 justify-between">
                  <h2 className="text-2xl">
                    {plan.plan_name.charAt(0).toUpperCase() +
                      plan.plan_name.slice(1)}{" "}
                    Plan
                  </h2>
                  <div
                    className="border p-1 rounded-md border-gray-700 cursor-pointer"
                    onClick={() => toggleDropdown(plan.id)}
                  >
                    <CiMenuKebab className="rotate-90  p-0 size-6" />
                  </div>
                </div>
                {openDropdown === plan.id && (
                  <div
                    className="absolute top-16 right-5 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-2 z-10"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => handleEdit(plan)}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-700 w-full text-left flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit Plan
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-700 w-full text-left"
                    >
                      <AiOutlineDelete className="mr-2" /> Delete Plan
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-x-10 gap-y-6">
                    <div>
                      <h3 className="underline underline-offset-2 mb-1 text-lg">
                        Description
                      </h3>
                      <p className="max-w-40">{plan.description}</p>
                    </div>
                    <div>
                      <h3 className="underline underline-offset-2 mb-1 text-lg">
                        Features
                      </h3>
                      <ul className="list-disc">
                        {plan.features.split(",").map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="underline underline-offset-2 mb-1 text-lg">
                        Duration in Months
                      </h3>
                      <p>{plan.duration_in_months}</p>
                    </div>
                    <div>
                      <h3 className="underline underline-offset-2 mb-1">
                        Active
                      </h3>
                      <p>{plan.is_active ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-end max-w-full">
                    <p className="text-2xl font-medium mb-2">
                      ₹{plan.monthly_price}
                    </p>
                    <p className="text-gray-400 text-sm">per month</p>
                    <p className="text-4xl font-medium mb-2 mt-4">
                      ₹{plan.annual_price}
                    </p>
                    <p className="text-gray-400 text-sm">per year</p>
                    <p className="text-3xl font-medium mb-2 mt-4">
                      ₹{plan.custom_price}
                    </p>
                    <p className="text-gray-400 text-sm">custom price</p>
                    <p className="text-gray-400 mt-2">
                      Only valid for {plan.duration_in_months} months
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* add plan and pricing modal */}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        center
        classNames={{
          modal: "planpriceaddmodal",
        }}
        closeIcon
      >
        <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-800 border-none">
          <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
            <div className="absolute top-2 end-2">
              <button
                onClick={onCloseModal}
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-purple-600 transition-all text-sm"
              >
                <span className="sr-only">Close</span>
                <MdClose className="flex-shrink-0 size-4" />
              </button>
            </div>

            <figure className="absolute inset-x-0 bottom-0">
              <svg
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
              >
                <path
                  fill="currentColor"
                  className="fill-white dark:fill-neutral-800"
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </svg>
            </figure>
          </div>

          <div className="relative z-10 -mt-12">
            <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
              <MdAttachMoney className="size-8 text-gray-800" />
            </span>
          </div>

          <div className="p-4 overflow-y-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Add Plan and Pricing
              </h3>
            </div>
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-4 mx-auto w-full">
              <div className="mt-0 w-full mx-auto">
                <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                  <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Fill the plan details
                  </h2>
                  <div className="mb-2">
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      id="plan_name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="plan"
                      required
                      value={planAndPricingForm.plan_name}
                      onChange={handleChange}
                    />
                    {errors.plan_name && (
                      <p className="text-red-600 text-sm font-medium">
                        {errors.plan_name}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="description"
                      value={planAndPricingForm.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm font-medium">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Features
                    </label>
                    <textarea
                      id="features"
                      rows="4"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="features"
                      value={planAndPricingForm.features}
                      onChange={handleChange}
                    />
                    {errors.features && (
                      <p className="text-red-600 text-sm font-medium">
                        {errors.features}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Monthly price
                      </label>
                      <input
                        type="number"
                        id="monthly_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="monthly price"
                        required
                        value={planAndPricingForm.monthly_price}
                        onChange={handleChange}
                      />
                      {errors.monthly_price && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.monthly_price}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Annual Price
                      </label>
                      <input
                        type="number"
                        id="annual_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="annual price"
                        required
                        value={planAndPricingForm.annual_price}
                        onChange={handleChange}
                      />
                      {errors.annual_price && (
                        <p className="text-red-600 text-sm font-medium">
                          {errors.annual_price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Custom Price
                      </label>
                      <input
                        type="number"
                        id="custom_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="custom price"
                        required
                        value={planAndPricingForm.custom_price}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Duration in Months
                      </label>
                      <input
                        type="number"
                        id="duration_in_months"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="duration in months"
                        required
                        value={planAndPricingForm.duration_in_months}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {success && (
                <div
                  className="mt-3 bg-purple-100 border-t-2 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Plan and Pricing.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-x-2">
              <a
                onClick={handleSubmit}
                className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                <MdOutlineAddCircle className="size-5" />
                Add Plan
              </a>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openEditModal}
        onClose={onCloseEditModal}
        center
        classNames={{
          modal: "planpriceaddmodal",
        }}
        closeIcon
      >
        <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-800 border-none">
          <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
            <div className="absolute top-2 end-2">
              <button
                onClick={onCloseEditModal}
                type="button"
                className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:border-none focus:ring-2 focus:ring-purple-600 transition-all text-sm"
              >
                <span className="sr-only">Close</span>
                <MdClose className="flex-shrink-0 size-4" />
              </button>
            </div>

            <figure className="absolute inset-x-0 bottom-0">
              <svg
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
              >
                <path
                  fill="currentColor"
                  className="fill-white dark:fill-neutral-800"
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </svg>
            </figure>
          </div>

          <div className="relative z-10 -mt-12">
            <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
              <MdAttachMoney className="size-8 text-gray-800" />
            </span>
          </div>

          <div className="p-4 overflow-y-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                Update Plan and Pricing
              </h3>
            </div>
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-4 mx-auto w-full">
              <div className="mt-0 w-full mx-auto">
                <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                  <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Fill the plan details
                  </h2>
                  <div className="mb-2">
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      id="plan_name"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="plan"
                      required
                      value={editPlanPricingForm.plan_name}
                      onChange={handleEditChange}
                    />
                    {editErrors.plan_name && (
                      <p className="text-red-600 text-sm font-medium">
                        {editErrors.plan_name}
                      </p>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="description"
                      value={editPlanPricingForm.description}
                      onChange={handleEditChange}
                    />
                    {editErrors.description && (
                      <p className="text-red-600 text-sm font-medium">
                        {editErrors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                      Features
                    </label>
                    <textarea
                      id="features"
                      rows="4"
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                      placeholder="features"
                      value={editPlanPricingForm.features}
                      onChange={handleEditChange}
                    />
                    {editErrors.features && (
                      <p className="text-red-600 text-sm font-medium">
                        {editErrors.features}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Monthly price
                      </label>
                      <input
                        type="number"
                        id="monthly_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="monthly price"
                        required
                        value={editPlanPricingForm.monthly_price}
                        onChange={handleEditChange}
                      />
                      {editErrors.monthly_price && (
                        <p className="text-red-600 text-sm font-medium">
                          {editErrors.monthly_price}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Annual Price
                      </label>
                      <input
                        type="number"
                        id="annual_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="annual price"
                        required
                        value={editPlanPricingForm.annual_price}
                        onChange={handleEditChange}
                      />
                      {editErrors.annual_price && (
                        <p className="text-red-600 text-sm font-medium">
                          {editErrors.annual_price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Custom Price
                      </label>
                      <input
                        type="number"
                        id="custom_price"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="custom price"
                        required
                        value={editPlanPricingForm.custom_price}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">
                        Duration in Months
                      </label>
                      <input
                        type="number"
                        id="duration_in_months"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="duration in months"
                        required
                        value={editPlanPricingForm.duration_in_months}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {success && (
                <div
                  className="mt-3 bg-purple-100 border-t-2 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </span>
                    </div>
                    <div className="ms-3">
                      <h3 className="text-gray-800 font-semibold dark:text-white">
                        Plan and Pricing.
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-neutral-400">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-x-2">
              <a
                onClick={handleEditSubmit}
                className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                <FaSync className="size-4" />
                Update Plan
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* delete modal */}

      <Modal
        open={openDeleteModal}
        onClose={onCloseDeleteModal}
        center
        classNames={{
          modal: "deleteModal",
        }}
        closeIcon
      >
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
          <FaTimes
            className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
            onClick={onCloseDeleteModal}
          />

          <div className="my-4 text-center">
            <FaTrashAlt className="size-16 text-red-600 inline" />
            <h4 className="text-gray-800 text-base font-semibold mt-4">
              Are you sure you want to delete this plan?
            </h4>

            <div className="text-center space-x-4 mt-8">
              <button
                onClick={onCloseDeleteModal}
                type="button"
                className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                type="button"
                className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          {success && (
            <div
              id="dismiss-alert"
              class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-purple-50 border border-purple-200 text-sm text-purple-800 rounded-lg p-4 dark:bg-purple-800/10 dark:border-purple-900 dark:text-purple-500"
              role="alert"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <FaCheckCircle className="flex-shrink-0 size-4 mt-0.5 text-purple-500" />
                </div>
                <div class="ms-2">
                  <div class="text-sm font-medium">{success}</div>
                </div>
                <div class="ps-3 ms-auto">
                  <div class="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      class="inline-flex bg-purple-50 rounded-lg p-1.5 text-purple-500 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-50 focus:ring-purple-600 dark:bg-transparent dark:hover:bg-purple-800/50 dark:text-purple-600"
                      data-hs-remove-element="#dismiss-alert"
                    >
                      <span className="sr-only">Dismiss</span>
                      <FaTimes className="flex-shrink-0 size-4 mt-1 " />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PlanAndPricing;
