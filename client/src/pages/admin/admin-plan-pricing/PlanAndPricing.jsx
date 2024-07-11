import { useState, useEffect } from "react";
import {
  MdAdd,
  MdClose,
  MdAttachMoney,
  MdOutlineAddCircle,
} from "react-icons/md";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FiChevronDown, FiEdit, FiTrash, FiSave } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import "./planprice.css";

const PlanAndPricing = () => {
  const [planAndPricingForm, setPlanAndPricingForm] = useState({
    plan_name: "",
    description: "",
    features: "",
    monthly_price: "",
    annual_price: "",
    custom_price: "",
    duration_in_months: "",
    products: [],
    plan: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectProductsDropdown, setSelectProductsDropdown] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectPlanDropdown, setSelectPlanDropdown] = useState(false);

  const [planModal, setPlanModal] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planError, setPlanError] = useState({});
  const [addedPlans, setAddedPlans] = useState([]);

  const [planList, setPlanList] = useState([]);
  const [planListDropdown, setPlanListDropdown] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);
  const [editPlanName, setEditPlanName] = useState("");
  const [deletePlanModal, setDeletePlanModal] = useState(false);
  const [planIdToDelete, setPlanIdToDelete] = useState(null);
  const [planSuccess, setPlanSuccess] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const navigate = useNavigate();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  useEffect(() => {
    if (!openModal) {
      setErrors({});
      setSelectProductsDropdown(false);
      setSelectedProducts([]);
      setSelectedPlan("");
      setSelectPlanDropdown(false);
      setPlanAndPricingForm({
        plan_name: "",
        description: "",
        features: "",
        monthly_price: "",
        annual_price: "",
        custom_price: "",
        duration_in_months: "",
        plan: "",
        products: [],
      });
    }
  }, [openModal]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPlanAndPricingForm({ ...planAndPricingForm, [id]: value });

    validateField(id, value);
  };

  const formatFeatures = (features) => {
    return features
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "")
      .join(", ");
  };

  const validateField = (id, value) => {
    let errorMessage = "";

    switch (id) {
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(planAndPricingForm).forEach((field) => {
      if (field !== "custom_price" && field !== "duration_in_months") {
        const value = planAndPricingForm[field];

        if (field === "products" || field === "plan") {
          return;
        }

        if (typeof value === "string" && value.trim() === "") {
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

    if (selectedProducts.length === 0) {
      isValid = false;
      newErrors.products = "At least one product must be selected";
    }

    if (!selectedPlan) {
      isValid = false;
      newErrors.plan = "Plan is required";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedFeatures = formatFeatures(planAndPricingForm.features);

    const formData = {
      ...planAndPricingForm,
      products: selectedProducts.map((product) => product.id),
      features: formattedFeatures,
    };

    try {
      const res = await axios.post(
        `${config.baseApiUrl}admin/create-subscription-plan/`,
        formData
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        setTimeout(() => {
          setSuccess("");
          onCloseModal();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductClick = (product) => {
    const isSelected = selectedProducts.some((item) => item.id === product.id);
    if (isSelected) {
      const updatedProducts = selectedProducts.filter(
        (item) => item.id !== product.id
      );
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      products: "",
    }));
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setPlanAndPricingForm({
      ...planAndPricingForm,
      plan: plan.id,
      plan_name: plan.name,
    });
    setErrors((prevErrors) => ({ ...prevErrors, plan: "" }));
    setSelectPlanDropdown(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchAddedPlans = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-plan/`);
      if (res.status === 200) {
        setAddedPlans(res.data);
        setPlanList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddedPlans();
  }, []);

  const handlePlanNameChange = (e) => {
    setPlanName(e.target.value);
    if (e.target.value === "") {
      setPlanError({ plan_name: "Plan name is required" });
    } else if (checkPlanNameExists(e.target.value)) {
      setPlanError({ plan_name: "Plan name already exists" });
    } else {
      setPlanError({});
    }
  };

  useEffect(() => {
    if (!planModal) {
      setPlanName("");
      setPlanError({});
    }
  }, [planModal]);

  const checkPlanNameExists = (name) => {
    return addedPlans.some(
      (plan) => plan.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handlePlanSubmit = async () => {
    if (planName === "") {
      setPlanError({ plan_name: "Plan name is required" });
      return;
    }
    if (checkPlanNameExists(planName)) {
      setPlanError({ plan_name: "Plan name already exists" });
      return;
    }
    const formattedName =
      planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();

    try {
      const response = await axios.post(`${config.baseApiUrl}admin/add-plan/`, {
        name: formattedName,
      });
      if (response.status === 200) {
        setSuccess(response.data.message);
        fetchAddedPlans();
        setTimeout(() => {
          setPlanName("");
          setPlanModal(false);
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const togglePlanListDropdown = () => {
    setPlanListDropdown(!planListDropdown);
  };

  const handleEditPlanClick = (plan) => {
    setEditPlanId(plan.id);
    setEditPlanName(plan.name);
  };

  const handleEditPlan = async (id) => {
    try {
      const res = await axios.put(
        `${config.baseApiUrl}admin/update-plan/${id}/`,
        {
          name: editPlanName,
        }
      );
      if (res.status === 200) {
        setPlanSuccess(res.data.message);
        fetchAddedPlans();
        setEditPlanId(null);
        setEditPlanName("");
        setTimeout(() => {
          setPlanSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePlanClick = (id) => {
    setPlanIdToDelete(id);
    setDeletePlanModal(true);
  };

  const confirmDeletePlan = async () => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/update-plan/${planIdToDelete}/`
      );
      if (res.status === 200) {
        setDeleteSuccess(res.data.message);
        fetchAddedPlans();
        setPlanIdToDelete(null);
        setTimeout(() => {
          setDeleteSuccess("");
          setDeletePlanModal(false);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!planListDropdown) {
      setEditPlanId(null);
      setEditPlanName("");
      setPlanIdToDelete(null);
    }
  }, [planListDropdown]);

  return (
    <>
      <div className="bg-[rgb(16,23,42)]">
        <AdminNav />
        <div className="flex min-h-screen pt-20">
          <div className="w-fit md:fixed top-20 left-0 min-h-screen bottom-0 md:block hidden z-50">
            <AdminSidebar sidebarToggle={sidebarToggle} />
          </div>

          <div
            className={`flex-1 min-h-screen overflow-auto transition-all duration-300 z-40 ${
              isSidebarCollapsed ? "md:ml-64 ml-0" : "md:ml-20 ml-0 md:px-16"
            }`}
          >
            <div className="flex pt-10 px-4 overflow-auto">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-nowrap text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/plan-pricing">Plan & Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="text-white py-10 px-4">
              <div className="px-4 flex flex-col justify-end gap-4">
                <div className="flex items-center gap-4 justify-end">
                  <button
                    onClick={() => setPlanModal(true)}
                    className="py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-purple-600 text-slate-950 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <MdAdd className="flex-shrink-0 size-5" />
                    Add Plan
                  </button>
                  <button
                    onClick={onOpenModal}
                    className="py-3 px-2 flex justify-center items-center gap-x-2 text-sm text-nowrap font-medium rounded-lg border border-transparent bg-purple-600 text-slate-950 hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <MdAdd className="flex-shrink-0 size-5" />
                    Add New Product Plan
                  </button>
                </div>
                <div className="flex justify-end mb-2">
                  <div className="relative rounded-lg w-max">
                    <button
                      type="button"
                      className="px-4 py-3 rounded-lg flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-slate-950 text-sm font-medium border-purple-700 outline-none transition duration-300 ease-in-out transform"
                      onClick={togglePlanListDropdown}
                    >
                      Plan list
                      <FiChevronDown
                        className="inline ml-3 size-5 transition-transform duration-300 ease-in-out transform"
                        style={{
                          transform: planListDropdown
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>

                    {planListDropdown && (
                      <ul className="absolute shadow-xl bg-slate-900 border border-gray-800 mt-2 right-0 py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto transition-opacity duration-300 ease-in-out opacity-100">
                        {planList.map((plan) => (
                          <li
                            key={plan.id}
                            className="py-2.5 px-5 text-white text-sm cursor-pointer flex justify-between items-center transition-transform duration-300 ease-in-out transform"
                          >
                            {editPlanId === plan.id ? (
                              <input
                                type="text"
                                value={editPlanName}
                                onChange={(e) =>
                                  setEditPlanName(e.target.value)
                                }
                                className="px-2 py-1 rounded-lg bg-transparent border border-gray-700 focus:border-purple-600 focus:ring-0 focus:outline-none transition-transform duration-300 ease-in-out transform"
                              />
                            ) : (
                              <span>{plan.name}</span>
                            )}
                            <div className="flex items-center ml-14 space-x-2">
                              {editPlanId === plan.id ? (
                                <button
                                  className="text-green-700 hover:underline"
                                  onClick={() => handleEditPlan(plan.id)}
                                >
                                  <FiSave className="size-5 transition-transform duration-300 ease-in-out transform hover:scale-125" />
                                </button>
                              ) : (
                                <button
                                  className="text-blue-600 hover:underline"
                                  onClick={() => handleEditPlanClick(plan)}
                                >
                                  <FiEdit className="size-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
                                </button>
                              )}
                              <button
                                className="text-red-600 hover:underline"
                                onClick={() => handleDeletePlanClick(plan.id)}
                              >
                                <FiTrash className="size-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addedPlans.map((plan) => (
                  <div
                    onClick={() =>
                      navigate(`/admin/plan-pricing/plan/${plan.id}`)
                    }
                    key={plan.id}
                    className="bg-gray-800 cursor-pointer border border-gray-700 px-4 py-28 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    <h3 className="text-6xl text-slate-400 text-center font-medium">
                      {plan.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* add plan modal */}

            <Modal
              open={planModal}
              onClose={() => setPlanModal(false)}
              center
              classNames={{
                modal: "planpriceplanaddmodal",
              }}
              closeIcon
            >
              <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
                <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                  <div className="absolute top-2 end-2">
                    <button
                      onClick={() => setPlanModal(false)}
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
                    <h3 className="text-lg font-semibold text-white">
                      Add Plan
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white">
                          Fill the plan details
                        </h2>
                        <div className="mb-2">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="plan name"
                            required
                            value={planName}
                            onChange={handlePlanNameChange}
                          />
                          {planError.plan_name && (
                            <p className="text-red-600 text-sm font-medium">
                              {planError.plan_name}
                            </p>
                          )}
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
                              Plan.
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
                      onClick={handlePlanSubmit}
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <MdOutlineAddCircle className="size-5" />
                      Add Plan
                    </a>
                  </div>
                </div>
              </div>
            </Modal>

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
              <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
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
                    <h3 className="text-lg font-semibold text-white">
                      Add Product Subscription Plan
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white">
                          Fill the product plan details
                        </h2>
                        <div className="mb-2">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Plan
                          </label>
                          <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                            <button
                              onClick={() =>
                                setSelectPlanDropdown(!selectPlanDropdown)
                              }
                              className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                            >
                              <span className="pr-4 text-sm text-white">
                                {selectedPlan
                                  ? selectedPlan.name
                                  : "Select plan"}
                              </span>
                              <FiChevronDown
                                id="rotate1"
                                className="absolute z-10 cursor-pointer right-5 text-white"
                                size={14}
                              />
                            </button>
                            <div
                              onMouseLeave={() => setSelectPlanDropdown(false)}
                              className={`absolute right-0 z-20 ${
                                selectPlanDropdown ? "" : "hidden"
                              } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                            >
                              {addedPlans.map((plan) => (
                                <a key={plan.id}>
                                  <p
                                    className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                    onClick={() => handlePlanClick(plan)}
                                  >
                                    {plan.name}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                          {errors.plan && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.plan}
                            </p>
                          )}
                        </div>
                        <div className="flex md:flex-row flex-col gap-4">
                          <div className="mb-2 w-full">
                            <label className="block mb-2 text-sm text-white font-medium">
                              Description
                            </label>
                            <textarea
                              id="description"
                              rows="4"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
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
                          <div className="w-full">
                            <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                              Features
                            </label>
                            <textarea
                              id="features"
                              rows="4"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                              placeholder="features"
                              value={planAndPricingForm.features}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              ( Add commas to separate features )
                            </p>
                            {errors.features && (
                              <p className="text-red-600 text-sm font-medium">
                                {errors.features}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-2">
                          <div>
                            <label className="block mb-2 text-sm text-white font-medium">
                              Monthly price
                            </label>
                            <input
                              type="number"
                              id="monthly_price"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
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
                            <label className="block mb-2 text-sm text-white font-medium">
                              Annual Price
                            </label>
                            <input
                              type="number"
                              id="annual_price"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
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
                            <label className="block mb-2 text-sm text-white font-medium">
                              Custom Price
                            </label>
                            <input
                              type="number"
                              id="custom_price"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                              placeholder="custom price"
                              required
                              value={planAndPricingForm.custom_price}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm text-white font-medium">
                              Duration in Months
                            </label>
                            <input
                              type="number"
                              id="duration_in_months"
                              className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                              placeholder="duration in months"
                              required
                              value={planAndPricingForm.duration_in_months}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="w-full mt-2">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Select products
                          </label>
                          <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                            <button
                              onClick={() =>
                                setSelectProductsDropdown(
                                  !selectProductsDropdown
                                )
                              }
                              className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                            >
                              <span className="pr-4 text-sm text-white">
                                Select products
                              </span>
                              <FiChevronDown
                                id="rotate1"
                                className="absolute z-10 cursor-pointer right-5 text-white"
                                size={14}
                              />
                            </button>
                            <div
                              onMouseLeave={() =>
                                setSelectProductsDropdown(false)
                              }
                              className={`absolute right-0 z-20 ${
                                selectProductsDropdown ? "" : "hidden"
                              } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                            >
                              {products.map((product) => (
                                <a key={product.id}>
                                  <p
                                    className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                    onClick={() => handleProductClick(product)}
                                  >
                                    <img
                                      src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                      className="w-8 h-8 rounded-full shrink-0 mr-3"
                                    />
                                    {product.name}
                                    {selectedProducts.includes(product) && (
                                      <FaCheck className="ml-auto size-4" />
                                    )}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                          {selectedProducts.length > 0 && (
                            <p className="text-gray-500 text-sm mt-1">
                              {selectedProducts
                                .map((product) => product.name)
                                .join(", ")}
                            </p>
                          )}
                          {errors.products && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.products}
                            </p>
                          )}
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
                              Product Subscription Plan.
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
                      className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <MdOutlineAddCircle className="size-5" />
                      Add Product Plan
                    </a>
                  </div>
                </div>
              </div>
            </Modal>

            {/* delete plan modal */}

            <Modal
              open={deletePlanModal}
              onClose={() => setDeletePlanModal(false)}
              center
              classNames={{
                modal: "deleteModal",
              }}
              closeIcon
            >
              <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
                <FaTimes
                  className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                  onClick={() => setDeletePlanModal(false)}
                />

                <div className="my-4 text-center">
                  <FaTrashAlt className="size-16 text-red-600 inline" />
                  <h4 className="text-gray-200 text-base font-semibold mt-4">
                    Are you sure you want to delete this plan?
                  </h4>

                  <div className="text-center space-x-4 mt-8">
                    <button
                      onClick={() => setDeletePlanModal(false)}
                      type="button"
                      className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeletePlan}
                      type="button"
                      className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {deleteSuccess && (
                  <div
                    id="dismiss-alert"
                    className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-purple-50 border border-purple-200 text-sm text-purple-800 rounded-lg p-4 dark:bg-purple-800/10 dark:border-purple-900 dark:text-purple-500"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaCheckCircle className="flex-shrink-0 size-4 mt-0.5 text-purple-500" />
                      </div>
                      <div className="ms-2">
                        <div className="text-sm font-medium">
                          {deleteSuccess}
                        </div>
                      </div>
                      <div className="ps-3 ms-auto">
                        <div className="-mx-1.5 -my-1.5">
                          <button
                            type="button"
                            className="inline-flex bg-purple-50 rounded-lg p-1.5 text-purple-500 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-50 focus:ring-purple-600 dark:bg-transparent dark:hover:bg-purple-800/50 dark:text-purple-600"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanAndPricing;
