import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../Functions/config";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import {
  FaEdit,
  FaSync,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { MdClose, MdAttachMoney } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { GiCheckMark } from "react-icons/gi";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./planprice.css";
const PlanPricingPlanView = () => {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const { id } = useParams();

  const [plans, setPlans] = useState([]);

  const [editPlanPricingForm, setEditPlanPricingForm] = useState({
    plan_name: "",
    description: "",
    features: "",
    monthly_price: "",
    annual_price: "",
    custom_price: "",
    duration_in_months: "",
    product: {},
    plan: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  const [editErrors, setEditErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const onOpenEditModal = () => setOpenEditModal(true);
  const onCloseEditModal = () => setOpenEditModal(false);
  const [editPlan, setEditPlan] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onOpenDeleteModal = () => setOpenDeleteModal(true);
  const onCloseDeleteModal = () => setOpenDeleteModal(false);
  const [deletePlanId, setDeletePlanId] = useState(null);

  const [products, setProducts] = useState([]);
  const [editSelectedProduct, setEditSelectedProduct] = useState(null);
  const [editProductsDropdown, setEditProductsDropdown] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectPlanDropdown, setSelectPlanDropdown] = useState(false);

  const [addedPlans, setAddedPlans] = useState([]);
  const naviagate = useNavigate();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchAddedPlans = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-plan/`);
      if (res.status === 200) {
        setAddedPlans(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAddedPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${config.baseApiUrl}admin/create-subscription-plan/`,
        {
          params: { plan_id: id },
        }
      );
      if (response.status === 200) {
        setPlans(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!openEditModal) {
      setEditProductsDropdown(false);
      setSelectPlanDropdown(false);
      setEditSelectedProduct(null);
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
        product: {},
        plan: "",
      });
    }
  }, [openEditModal]);

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditPlanPricingForm({ ...editPlanPricingForm, [id]: value });
    validateEditField(id, value);
  };

  const validateEditField = (id, value) => {
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

    setEditErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const validateEditForm = () => {
    let isValid = true;
    const newEditErrors = {};

    Object.keys(editPlanPricingForm).forEach((field) => {
      if (field !== "custom_price" && field !== "duration_in_months") {
        const value = editPlanPricingForm[field];

        if (field === "product" || field === "plan") {
          return;
        }

        if (typeof value === "string" && value.trim() === "") {
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

    if (!editSelectedProduct) {
      isValid = false;
      newEditErrors.product = "At least one product must be selected";
    }

    setEditErrors(newEditErrors);
    return isValid;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    const formattedFeatures = formatFeatures(editPlanPricingForm.features);

    const formData = {
      ...editPlanPricingForm,
      product: editSelectedProduct.id,
      features: formattedFeatures,
    };

    try {
      const res = await axios.put(
        `${config.baseApiUrl}admin/update-subscription-plan/${editPlan.id}/`,
        formData
      );
      if (res.status === 200) {
        setSuccess(res.data.message);
        if (editPlanPricingForm.plan.id === id) {
          setPlans((prevPlans) => {
            return prevPlans.map((plan) =>
              plan.id === editPlan.id ? res.data.data : plan
            );
          });
        } else {
          fetchPlans();
        }
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
      features: formatFeatures(plan.features),
      monthly_price: plan.monthly_price,
      annual_price: plan.annual_price,
      custom_price: plan.custom_price,
      duration_in_months: plan.duration_in_months,
      plan: plan.plan.id,
    });
    setEditSelectedProduct(plan.product);
    setSelectedPlan(plan.plan.name);
    onOpenEditModal();
  };

  const handleDelete = (planId) => {
    onOpenDeleteModal();
    setDeletePlanId(planId);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/update-subscription-plan/${deletePlanId}/`
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

  const handleEditProductClick = (clickedProduct) => {
    if (editSelectedProduct?.id === clickedProduct.id) {
      setEditSelectedProduct(null);
    } else {
      setEditSelectedProduct(clickedProduct);
    }
    setEditErrors((prevErrors) => ({
      ...prevErrors,
      product: "",
    }));
  };

  const formatFeatures = (features) => {
    return features
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "")
      .join(", ");
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan.name);
    setEditPlanPricingForm({
      ...editPlanPricingForm,
      plan: plan.id,
      plan_name: plan.name,
    });
    setSelectPlanDropdown(false);
  };

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
                <li className="bg-gray-800 text-nowrap text-purple-500 hover:underline rounded-r-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/plan-pricing">Plan & Pricing</Link>
                </li>
                <li className="bg-purple-600 text-nowrap text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to={`/admin/plan-pricing/plan/${id}`}>
                    Plan & Pricing Plan
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-white py-10 px-4">
              <div className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    
                    <div
                      onMouseLeave={() => setOpenDropdown(null)}
                      key={plan.id}
                      className="relative bg-slate-900 rounded-lg border border-b-2 border-gray-700 shadow-sm shadow-gray-500 transition-shadow duration-300 hover:-translate-y-1"
                    >
                      
                      <div className="p-2 pb-4">
                        <img
                          src={`${config.baseApiImageUrl}${plan.product.images[0].image}`}
                          alt={plan.product.name}
                          className="w-full h-52 object-cover rounded-md mb-4 cursor-pointer"
                        />
                        <h3
                          onClick={() =>
                            naviagate(
                              `/admin/product-features-details/${plan.product.id}`
                            )
                          }
                          className="text-2xl text-center underline cursor-pointer"
                        >
                          {plan.product.name}
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="relative flex items-baseline mb-6 justify-between gap-10">
                          <h2 className="text-3xl">
                            {plan.plan_name.charAt(0).toUpperCase() +
                              plan.plan_name.slice(1)}{" "}
                            Plan
                          </h2>
                          <div
                            className="relative border p-1 rounded-md border-gray-700 cursor-pointer"
                            onClick={() => toggleDropdown(plan.id)}
                          >
                            <CiMenuKebab className="rotate-90  p-0 size-6" />
                            {openDropdown === plan.id && (
                              <div
                                className="absolute w-max top-10 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
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
                                  <AiOutlineDelete className="mr-2" /> Delete
                                  Plan
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

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
                              <ul className="flex flex-col gap-[1px]">
                                {plan.features
                                  .split(",")
                                  .map((feature, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <GiCheckMark className="text-sm bg-transparent fill-gray-100" />
                                      {feature.trim()}
                                    </li>
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
                            <p className="text-gray-400 text-sm">
                              custom price
                            </p>
                            <p className="text-gray-400 mt-2">
                              Only valid for {plan.duration_in_months} months
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* edit plan modal */}

      <Modal
        open={openEditModal}
        onClose={onCloseEditModal}
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
              <h3 className="text-lg font-semibold text-white">
                Update Product Subscription Plan
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
                          {selectedPlan}
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
                        value={editPlanPricingForm.description}
                        onChange={handleEditChange}
                      />
                      {editErrors.description && (
                        <p className="text-red-600 text-sm font-medium">
                          {editErrors.description}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm text-white font-medium">
                        Features
                      </label>
                      <textarea
                        id="features"
                        rows="4"
                        className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="features"
                        value={editPlanPricingForm.features}
                        onChange={handleEditChange}
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        ( Add commas to separate features )
                      </p>

                      {editErrors.features && (
                        <p className="text-red-600 text-sm font-medium">
                          {editErrors.features}
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
                      <label className="block mb-2 text-sm text-white font-medium">
                        Annual Price
                      </label>
                      <input
                        type="number"
                        id="annual_price"
                        className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
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
                      <label className="block mb-2 text-sm text-white font-medium">
                        Custom Price
                      </label>
                      <input
                        type="number"
                        id="custom_price"
                        className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                        placeholder="custom price"
                        required
                        value={editPlanPricingForm.custom_price}
                        onChange={handleEditChange}
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
                        value={editPlanPricingForm.duration_in_months}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-2">
                    <label className="block mb-2 text-sm text-white font-medium">
                      Select product
                    </label>
                    <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                      <button
                        onClick={() =>
                          setEditProductsDropdown(!editProductsDropdown)
                        }
                        className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                      >
                        <span className="pr-4 text-sm text-white">
                          {editSelectedProduct
                            ? editSelectedProduct.name
                            : "Select product"}
                        </span>
                        <FiChevronDown
                          id="rotate1"
                          className="absolute z-10 cursor-pointer right-5 text-white"
                          size={14}
                        />
                      </button>
                      <div
                        onMouseLeave={() => setEditProductsDropdown(false)}
                        className={`absolute right-0 z-20 ${
                          editProductsDropdown ? "" : "hidden"
                        } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                      >
                        {products.map((product) => (
                          <a key={product.id}>
                            <p
                              className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                              onClick={() => handleEditProductClick(product)}
                            >
                              <img
                                src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                alt={`${product.name} image`}
                                className="w-8 h-8 rounded-full shrink-0 mr-3"
                              />
                              {product.name}
                              {editSelectedProduct?.id === product.id && (
                                <FaCheck className="ml-auto size-5" />
                              )}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                    {editErrors.product && (
                      <p className="text-red-600 text-sm font-medium">
                        {editErrors.product}
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
                onClick={handleEditSubmit}
                className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
              >
                <FaSync className="size-3" />
                Update Product Plan
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
        <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
          <FaTimes
            className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
            onClick={onCloseDeleteModal}
          />

          <div className="my-4 text-center">
            <FaTrashAlt className="size-16 text-red-600 inline" />
            <h4 className="text-gray-200 text-base font-semibold mt-4">
              Are you sure you want to delete this product subscription plan?
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
              className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 bg-purple-50 border border-purple-200 text-sm text-purple-800 rounded-lg p-4 dark:bg-purple-800/10 dark:border-purple-900 dark:text-purple-500"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="flex-shrink-0 size-4 mt-0.5 text-purple-500" />
                </div>
                <div className="ms-2">
                  <div className="text-sm font-medium">{success}</div>
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
    </>
  );
};

export default PlanPricingPlanView;
