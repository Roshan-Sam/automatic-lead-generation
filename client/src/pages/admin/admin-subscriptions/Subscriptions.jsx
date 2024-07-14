import axios from "axios";
import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiEdit,
  FiTrash,
  FiBell,
  FiPlus,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { CiMenuKebab, CiFilter } from "react-icons/ci";
import {
  FaRegPaperPlane,
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import "./subscriptions.css";

const Subscriptions = () => {
  const [companySubscriptions, setCompanySubscriptions] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [products, setproducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [addCompanySubscriptionModal, setAddCompanySubscriptionModal] =
    useState(false);
  const [periodOptions, setPeriodOptions] = useState([
    "Monthly",
    "Annual",
    "Custom",
  ]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectCompanyDropdown, setSelectCompanyDropdown] = useState(false);
  const [selectProductDropdown, setSelectProductDropdown] = useState(false);
  const [selectPlanDropdown, setSelectPlanDropdown] = useState(false);
  const [selectPeriodDropdown, setSelectPeriodDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [createCompSubForm, setCreateCompSubForm] = useState({
    company: null,
    subscription_plan: null,
    start_date: null,
    end_date: null,
    period: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 2;
  const [totalCount, setTotalCount] = useState(0);

  const [statusOptions, setStatusOptions] = useState([
    "Active",
    "Pending",
    "Inactive",
    "Canceled",
  ]);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [statusChangeDropdown, setStatusChangeDropdown] = useState(false);
  const [editDeleteDropdown, setEditDeleteDropdown] = useState(false);

  const [editCompSubForm, setEditCompSubForm] = useState({
    subscription_plan: null,
    start_date: null,
    end_date: null,
    period: null,
  });
  const [editCompanySubscriptionModal, setEditCompanySubscriptionModal] =
    useState(false);
  const [editSelectedSubscription, setEditSelectedSubscription] =
    useState(null);
  const [editSelectedCompany, setEditSelectedCompany] = useState(null);
  const [editSelectedProduct, setEditSelectedProduct] = useState(null);
  const [editSelectedPlan, setEditSelectedPlan] = useState(null);
  const [editSelectedPeriod, setEditSelectedPeriod] = useState("");
  const [editSelectProductDropdown, setEditSelectProductDropdown] =
    useState(false);
  const [editSelectPlanDropdown, setEditSelectPlanDropdown] = useState(false);
  const [editSelectPeriodDropdown, setEditSelectPeriodDropdown] =
    useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCompanySubscriptionId, setDeleteCompanySubscriptionId] =
    useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchCompanySubscriptions = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/subscriptions/`, {
        params: {
          search: searchTerm,
          status: selectedStatus,
          limit: LIMIT,
          offset: offset,
        },
      });
      if (res.status === 200) {
        const { company_subscriptions, total_count } = res.data;
        setCompanySubscriptions(company_subscriptions);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanySubscriptions();
  }, [searchTerm, offset, selectedStatus]);

  const calculatePeriod = (start_date, end_date) => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 30 || diffDays === 31) return "1 Month";
    if (diffDays === 365) return "1 Year";
    return `${diffDays} Days`;
  };

  const fetchCompaniesAndPlans = async () => {
    try {
      const companyRes = await axios.get(`${config.baseApiUrl}companies/`);
      setCompanies(companyRes.data);

      const subScriptionsRes = await axios.get(
        `${config.baseApiUrl}admin/create-subscription-plan/`
      );
      const plans = subScriptionsRes.data.data;
      setSubscriptionPlans(plans);

      const uniqueProductSet = new Set();
      plans.forEach((plan) => {
        if (plan.product && plan.product.id) {
          uniqueProductSet.add(JSON.stringify(plan.product));
        }
      });

      const uniqueProductArray = Array.from(uniqueProductSet).map((product) =>
        JSON.parse(product)
      );
      setproducts(uniqueProductArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompaniesAndPlans();
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setSelectCompanyDropdown(false);
    setCreateCompSubForm((prevData) => ({ ...prevData, company: company.id }));
    setErrors((prevErrors) => ({ ...prevErrors, company: "" }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectProductDropdown(false);
    setSelectedPlan(null);
    setPlans(
      subscriptionPlans.filter((plan) => plan.product.id === product.id)
    );
    setCreateCompSubForm((prevData) => ({
      ...prevData,
      subscription_plan: null,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, product: "" }));
  };

  const calculateEndDate = (startDate, months) => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    endDate.setHours(0, 0, 0, 0);
    return endDate.toLocaleDateString("en-CA");
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    setSelectPeriodDropdown(false);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = null;

    if (period === "Monthly") {
      endDate = calculateEndDate(startDate, 1);
    } else if (period === "Annual") {
      endDate = calculateEndDate(startDate, 12);
    } else if (period === "Custom" && selectedPlan) {
      endDate = calculateEndDate(startDate, selectedPlan.duration_in_months);
    }

    setCreateCompSubForm((prevData) => ({
      ...prevData,
      start_date: startDate.toLocaleDateString("en-CA"),
      end_date: endDate,
      period: period,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, period: "" }));
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setSelectPlanDropdown(false);
    setCreateCompSubForm((prevData) => ({
      ...prevData,
      subscription_plan: plan.id,
    }));
    if (selectedPeriod === "Custom") {
      const startDate = new Date();
      const endDate = calculateEndDate(startDate, plan.duration_in_months);
      setCreateCompSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate,
      }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, plan: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!createCompSubForm.company) {
      newErrors.company = "Company is required";
    }

    if (!selectedProduct) {
      newErrors.product = "Product is required";
    }

    if (!selectedPlan) {
      newErrors.plan = "Plan is required";
    }
    if (!selectedPeriod) {
      newErrors.period = "Period is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post(
        `${config.baseApiUrl}admin/subscriptions/`,
        createCompSubForm
      );
      if (response.status === 200) {
        setSuccess("Company Subscription created successfully.");
        fetchCompanySubscriptionsAfterCreation();
        setTimeout(() => {
          setSuccess("");
          setAddCompanySubscriptionModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchCompanySubscriptionsAfterCreation = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/subscriptions/`, {
        params: {
          search: "",
          status: "",
          limit: LIMIT,
          offset: 0,
        },
      });
      if (res.status === 200) {
        const { company_subscriptions, total_count } = res.data;
        setCompanySubscriptions(company_subscriptions);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!addCompanySubscriptionModal) {
      setSelectedCompany(null);
      setSelectedProduct(null);
      setSelectedPlan(null);
      setSelectedPeriod(null);
      setSelectCompanyDropdown(false);
      setSelectProductDropdown(false);
      setSelectPlanDropdown(false);
      setSelectPeriodDropdown(false);
      setCreateCompSubForm({
        company: null,
        subscription_plan: null,
        start_date: null,
        end_date: null,
      });
      setErrors([]);
    }
  }, [addCompanySubscriptionModal]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${config.baseApiUrl}admin/subscriptions/${id}/update/`,
        { status: newStatus }
      );
      if (searchTerm === "" && selectedStatus === "") {
        setCompanySubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription.id === id
              ? { ...subscription, status: newStatus }
              : subscription
          )
        );
      } else {
        handleClear();
        fetchCompaniesAndPlans();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setOffset(0);
  };

  const handleNext = () => {
    if (offset + LIMIT < totalCount) {
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };

  const handlePrevious = () => {
    if (offset > 0) {
      setOffset((prevOffset) => prevOffset - LIMIT);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "text-green-400 border-green-400";
      case "Pending":
        return "text-yellow-400 border-yellow-400";
      case "Inactive":
        return "text-gray-400 border-gray-400";
      case "Canceled":
        return "text-red-400 border-red-400";
      default:
        return "text-white border-white";
    }
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setOffset(0);
    setStatusDropdown(false);
  };

  const toggleStatusChange = (id) => {
    setStatusChangeDropdown((prev) => (prev === id ? null : id));
  };

  const toggleEditDelete = (id) => {
    setEditDeleteDropdown((prev) => (prev === id ? null : id));
  };

  const handleEdit = (subscription) => {
    setEditSelectedSubscription(subscription);
    setEditSelectedCompany(subscription.company);
    setEditSelectedProduct(subscription.subscription_plan.product);
    setEditSelectedPlan(subscription.subscription_plan);
    setEditSelectedPeriod(subscription.period);
    setEditCompanySubscriptionModal(true);
    setEditCompSubForm((prevData) => ({
      ...prevData,
      subscription_plan: subscription.subscription_plan.id,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      period: subscription.period,
    }));
    setPlans(
      subscriptionPlans.filter(
        (plan) => plan.product.id === subscription.subscription_plan.product.id
      )
    );
  };

  const handleEditProductClick = (product) => {
    setEditSelectedProduct(product);
    setEditSelectProductDropdown(false);
    setEditSelectedPlan(null);
    setPlans(
      subscriptionPlans.filter((plan) => plan.product.id === product.id)
    );
    setEditCompSubForm((prevData) => ({
      ...prevData,
      subscription_plan: null,
    }));
  };

  const handleEditPeriodClick = (period) => {
    setEditSelectedPeriod(period);
    setEditSelectPeriodDropdown(false);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = null;

    if (period === "Monthly") {
      endDate = calculateEndDate(startDate, 1);
    } else if (period === "Annual") {
      endDate = calculateEndDate(startDate, 12);
    } else if (period === "Custom" && editSelectedPlan) {
      endDate = calculateEndDate(
        startDate,
        editSelectedPlan.duration_in_months
      );
    }

    setEditCompSubForm((prevData) => ({
      ...prevData,
      start_date: startDate.toLocaleDateString("en-CA"),
      end_date: endDate,
      period: period,
    }));
  };

  const handleEditPlanClick = (plan) => {
    setEditSelectedPlan(plan);
    setEditSelectPlanDropdown(false);
    setEditCompSubForm((prevData) => ({
      ...prevData,
      subscription_plan: plan.id,
    }));
    if (editSelectedPeriod === "Custom") {
      const startDate = new Date();
      const endDate = calculateEndDate(startDate, plan.duration_in_months);
      setEditCompSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate,
      }));
    }
    setEditErrors((prevErrors) => ({ ...prevErrors, plan: "" }));
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editSelectedPlan) {
      newErrors.plan = "Plan is required";
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditCompanySubscription = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }
    try {
      const response = await axios.put(
        `${config.baseApiUrl}admin/subscriptions/${editSelectedSubscription.id}/update/`,
        editCompSubForm
      );
      if (response.status === 200) {
        setEditSuccess("Company subscription updated successfully.");
        if (searchTerm === "" && selectedStatus === "") {
          setCompanySubscriptions((prevSubscriptions) =>
            prevSubscriptions.map((subscription) =>
              subscription.id === editSelectedSubscription.id
                ? response.data
                : subscription
            )
          );
        } else {
          handleClear();
          fetchCompaniesAndPlans();
        }
        setTimeout(() => {
          setEditSuccess("");
          setEditCompanySubscriptionModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  useEffect(() => {
    if (!editCompanySubscriptionModal) {
      setEditSelectedCompany(null);
      setEditSelectedProduct(null);
      setEditSelectedPlan(null);
      setEditSelectedPeriod(null);
      setEditSelectProductDropdown(false);
      setEditSelectPlanDropdown(false);
      setEditSelectPeriodDropdown(false);
      setEditCompSubForm({
        subscription_plan: null,
        start_date: null,
        end_date: null,
        period: null,
      });
      setEditSelectedSubscription(null);
      setEditErrors({});
    }
  }, [editCompanySubscriptionModal]);

  const handleDelete = (id) => {
    setDeleteCompanySubscriptionId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${config.baseApiUrl}admin/subscriptions/${deleteCompanySubscriptionId}/delete/`
      );
      if (response.status === 200) {
        setDeleteSuccess("Company subscription deleted successfully.");
        fetchCompanySubscriptionsAfterCreation();
        fetchCompaniesAndPlans();
        setTimeout(() => {
          setDeleteSuccess("");
          setOpenDeleteModal(false);
          setDeleteCompanySubscriptionId(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
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
            <div className="flex pt-10 mb-12 px-4">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin-dash?tab=dash">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin-dash?tab=subscriptions">Subscriptions</Link>
                </li>
              </ul>
            </div>
            <div className="text-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-slate-900 shadow-gray-500 border border-gray-700 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-400 dark:border-neutral-700">
                        <div>
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Company Subscriptions
                          </h2>
                          <p className="text-sm text-white dark:text-neutral-400">
                            Here are the companies subscription plans and can be
                            added, deleted and updated.
                          </p>
                          <div className="sm:col-span-1 mt-2">
                            <label className="sr-only">Search</label>
                            <div className="relative">
                              <input
                                type="text"
                                id="search"
                                name="search"
                                className="py-2 px-3 ps-11 text-white block w-full bg-slate-900 border-gray-700 rounded-lg text-sm focus:border-purple-600 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Search by company name and plan ( basic, standard, premium )"
                                value={searchTerm}
                                onChange={handleSearchChange}
                              />
                              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                <FiSearch className="flex-shrink-0 size-4 text-slate-400 dark:text-neutral-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex md:justify-end">
                            <button
                              onClick={() =>
                                setAddCompanySubscriptionModal(true)
                              }
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <FiPlus className="flex-shrink-0 size-4" />
                              Add New Company Subscription
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative w-48  h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                              <button
                                onClick={() => {
                                  setStatusDropdown(!statusDropdown);
                                }}
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedStatus ? selectedStatus : "Status"}
                                </span>
                                <FiChevronDown
                                  id="rotate1"
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  statusDropdown ? "block" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {statusOptions.map((status, index) => (
                                  <a key={index}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() => handleStatusSelect(status)}
                                    >
                                      {status}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={handleClear}
                                type="button"
                                className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                              >
                                <CiFilter className="size-4 text-white" />
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <table className="min-w-full divide-y divide-gray-700 dark:divide-neutral-700">
                        <thead className="bg-gray-800 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Company Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Subscription Plan
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Subscription Plan Product
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Start Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              End Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Period
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Update Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 dark:divide-neutral-700">
                          {companySubscriptions.map((subscription, index) => (
                            <tr key={subscription.id}>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {index + 1}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {subscription.company.company_name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {subscription.subscription_plan.plan.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {subscription.subscription_plan.product.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {new Date(
                                  subscription.start_date
                                ).toLocaleString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {new Date(subscription.end_date).toLocaleString(
                                  "en-US",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {calculatePeriod(
                                  subscription.start_date,
                                  subscription.end_date
                                )}{" "}
                                / {subscription.period}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span
                                  className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded border ${getStatusClasses(
                                    subscription.status
                                  )}`}
                                >
                                  {subscription.status}
                                </span>
                              </td>
                              <td
                                className="px-6 py-3 whitespace-nowrap"
                                onMouseLeave={() =>
                                  setStatusChangeDropdown(null)
                                }
                              >
                                <div className="relative">
                                  <button
                                    className="flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white px-3 py-2"
                                    onClick={() =>
                                      toggleStatusChange(subscription.id)
                                    }
                                  >
                                    {subscription.status} <FiChevronDown />
                                  </button>
                                  {statusChangeDropdown === subscription.id && (
                                    <div
                                      onMouseLeave={() =>
                                        setStatusChangeDropdown(null)
                                      }
                                      className="absolute mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 overflow-y-scroll max-h-20"
                                    >
                                      {[
                                        "Active",
                                        "Pending",
                                        "Inactive",
                                        "Canceled",
                                      ].map((status) => (
                                        <button
                                          key={status}
                                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                                          onClick={() =>
                                            handleStatusChange(
                                              subscription.id,
                                              status
                                            )
                                          }
                                        >
                                          {status}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td
                                className="px-6 py-3 whitespace-nowrap"
                                onMouseLeave={() => setEditDeleteDropdown(null)}
                              >
                                <div className="relative flex justify-center text-left w-full">
                                  <div className="relative group rounded-xl w-fit border border-gray-700">
                                    <button
                                      onClick={() =>
                                        toggleEditDelete(subscription.id)
                                      }
                                      type="button"
                                      className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                    >
                                      <CiMenuKebab className="rotate-90 text-white" />
                                    </button>
                                    {editDeleteDropdown === subscription.id && (
                                      <div
                                        onMouseLeave={() =>
                                          setEditDeleteDropdown(null)
                                        }
                                        className="absolute mt-1 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                      >
                                        <button
                                          onClick={() =>
                                            handleEdit(subscription)
                                          }
                                          className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-700 w-full text-left flex items-center"
                                        >
                                          <FiEdit className="mr-2" />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDelete(subscription.id)
                                          }
                                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-700 w-full text-left"
                                        >
                                          <FiTrash className="mr-2" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-400 dark:border-neutral-700">
                        <div>
                          <p className="text-sm text-white dark:text-neutral-400">
                            <span className="font-semibold text-white dark:text-neutral-200">
                              {companySubscriptions.length}{" "}
                            </span>
                            results
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center gap-1">
                            <button
                              onClick={handlePrevious}
                              disabled={offset === 0}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <button
                              onClick={handleNext}
                              disabled={offset + LIMIT >= totalCount}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* create company subscription modal */}

            <Modal
              open={addCompanySubscriptionModal}
              onClose={() => setAddCompanySubscriptionModal(false)}
              center
              classNames={{
                modal: "customModal",
              }}
              closeIcon
            >
              <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
                <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                  <div className="absolute top-2 end-2">
                    <button
                      onClick={() => setAddCompanySubscriptionModal(false)}
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
                    <FiBell className="size-8 text-gray-800" />
                  </span>
                </div>

                <div className="p-4 sm:p-7 overflow-y-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white dark:text-neutral-200">
                      Create Company subscription
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white dark:text-neutral-200">
                          Fill the company subscription details
                        </h2>
                        <div>
                          <div className="flex flex-col">
                            <div>
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Company
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button
                                  onClick={() => {
                                    setSelectCompanyDropdown(
                                      !selectCompanyDropdown
                                    );
                                    setSelectPeriodDropdown(false);
                                    setSelectProductDropdown(false);
                                    setSelectPlanDropdown(false);
                                  }}
                                  className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span className="pr-4 text-sm text-white">
                                    {selectedCompany
                                      ? selectedCompany.company_name
                                      : "Select company"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  onMouseLeave={() =>
                                    setSelectCompanyDropdown(false)
                                  }
                                  className={`absolute right-0 z-20 ${
                                    selectCompanyDropdown ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                >
                                  {companies.map((company) => (
                                    <a key={company.id}>
                                      <p
                                        className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={() =>
                                          handleCompanyClick(company)
                                        }
                                      >
                                        {company.company_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.company && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.company}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Product
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button
                                  onClick={() => {
                                    setSelectProductDropdown(
                                      !selectProductDropdown
                                    );
                                    setSelectPeriodDropdown(false);
                                    setSelectCompanyDropdown(false);
                                    setSelectPlanDropdown(false);
                                  }}
                                  className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span className="pr-4 text-sm text-white">
                                    {selectedProduct
                                      ? selectedProduct.name
                                      : "Select product"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  onMouseLeave={() =>
                                    setSelectProductDropdown(false)
                                  }
                                  className={`absolute right-0 z-20 ${
                                    selectProductDropdown ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                >
                                  {products.map((product) => (
                                    <a key={product.id}>
                                      <p
                                        className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={() =>
                                          handleProductClick(product)
                                        }
                                      >
                                        {product.name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.product && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.product}
                                </p>
                              )}
                            </div>

                            {selectedProduct && (
                              <div className="mt-4">
                                <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                  Select Plan
                                </label>
                                <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                  <button
                                    onClick={() => {
                                      setSelectPlanDropdown(
                                        !selectPlanDropdown
                                      );
                                      setSelectPeriodDropdown(false);
                                      setSelectProductDropdown(false);
                                      setSelectCompanyDropdown(false);
                                    }}
                                    className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                  >
                                    <span className="pr-4 text-sm text-white">
                                      {selectedPlan
                                        ? selectedPlan.plan_name
                                        : "Select plan"}
                                    </span>
                                    <FiChevronDown
                                      className="absolute z-10 cursor-pointer right-5 text-white"
                                      size={14}
                                    />
                                  </button>
                                  <div
                                    onMouseLeave={() =>
                                      setSelectPlanDropdown(false)
                                    }
                                    className={`absolute right-0 z-20 ${
                                      selectPlanDropdown ? "" : "hidden"
                                    } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                  >
                                    {plans.map((plan) => (
                                      <a key={plan.id}>
                                        <p
                                          className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                          onClick={() => handlePlanClick(plan)}
                                        >
                                          {plan.plan_name}
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
                            )}

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Period
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button
                                  onClick={() => {
                                    setSelectPeriodDropdown(
                                      !selectPeriodDropdown
                                    );
                                    setSelectCompanyDropdown(false);
                                    setSelectProductDropdown(false);
                                    setSelectPlanDropdown(false);
                                  }}
                                  className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span className="pr-4 text-sm text-white">
                                    {selectedPeriod
                                      ? selectedPeriod
                                      : "Select period"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  onMouseLeave={() =>
                                    setSelectPeriodDropdown(false)
                                  }
                                  className={`absolute right-0 z-20 ${
                                    selectPeriodDropdown ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                >
                                  {periodOptions.map((period) => (
                                    <a key={period}>
                                      <p
                                        className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={() =>
                                          handlePeriodClick(period)
                                        }
                                      >
                                        {period}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.period && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.period}
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
                                  <FiCheckCircle className="flex-shrink-0 size-4" />
                                </span>
                              </div>
                              <div className="ms-3">
                                <h3 className="text-gray-800 font-semibold dark:text-white">
                                  Company Subscription Plan.
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-neutral-400">
                                  {success}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-x-2">
                    <a
                      onClick={handleSubmit}
                      className="py-2 inline-flex items-center gap-x-2 px-2 text-sm font-medium cursor-pointer rounded-lg border border-gray-700 bg-transparent text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <FaRegPaperPlane className="size-4" />
                      Create Company Subscription Plan
                    </a>
                  </div>
                </div>
              </div>
            </Modal>
            {/* Edit company subscription modal */}

            <Modal
              open={editCompanySubscriptionModal}
              onClose={() => setEditCompanySubscriptionModal(false)}
              center
              classNames={{
                modal: "customModal",
              }}
              closeIcon
            >
              <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
                <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                  <div className="absolute top-2 end-2">
                    <button
                      onClick={() => setEditCompanySubscriptionModal(false)}
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
                    <FiBell className="size-8 text-gray-800" />
                  </span>
                </div>
                <div className="p-4 sm:p-7 overflow-y-auto">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white dark:text-neutral-200">
                      Edit Company Subscription
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white dark:text-neutral-200">
                          Edit the company subscription details
                        </h2>
                        <div>
                          <div className="flex flex-col">
                            <div>
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Company
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg bg-gray-800 focus:bg-transparent">
                                  <span className="pr-4 text-sm text-white">
                                    {editSelectedCompany
                                      ? editSelectedCompany.company_name
                                      : "Select company"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Product
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button
                                  onClick={() => {
                                    setEditSelectProductDropdown(
                                      !editSelectProductDropdown
                                    );
                                    setEditSelectPeriodDropdown(false);
                                    setEditSelectPlanDropdown(false);
                                  }}
                                  className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span className="pr-4 text-sm text-white">
                                    {editSelectedProduct
                                      ? editSelectedProduct.name
                                      : "Select product"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  onMouseLeave={() =>
                                    setEditSelectProductDropdown(false)
                                  }
                                  className={`absolute right-0 z-20 ${
                                    editSelectProductDropdown ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                >
                                  {products.map((product) => (
                                    <a key={product.id}>
                                      <p
                                        className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={() =>
                                          handleEditProductClick(product)
                                        }
                                      >
                                        {product.name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {editSelectedProduct && (
                              <div className="mt-4">
                                <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                  Select Plan
                                </label>
                                <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                  <button
                                    onClick={() => {
                                      setEditSelectPlanDropdown(
                                        !editSelectPlanDropdown
                                      );
                                      setEditSelectPeriodDropdown(false);
                                      setEditSelectProductDropdown(false);
                                    }}
                                    className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                  >
                                    <span className="pr-4 text-sm text-white">
                                      {editSelectedPlan
                                        ? editSelectedPlan.plan_name
                                        : "Select plan"}
                                    </span>
                                    <FiChevronDown
                                      className="absolute z-10 cursor-pointer right-5 text-white"
                                      size={14}
                                    />
                                  </button>
                                  <div
                                    onMouseLeave={() =>
                                      setEditSelectPlanDropdown(false)
                                    }
                                    className={`absolute right-0 z-20 ${
                                      editSelectPlanDropdown ? "" : "hidden"
                                    } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                  >
                                    {plans.map((plan) => (
                                      <a key={plan.id}>
                                        <p
                                          className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                          onClick={() =>
                                            handleEditPlanClick(plan)
                                          }
                                        >
                                          {plan.plan_name}
                                        </p>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                                {editErrors.plan && (
                                  <p className="text-red-600 text-sm font-medium">
                                    {editErrors.plan}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Select Period
                              </label>
                              <div className="relative w-full h-fit border border-gray-700 rounded-lg outline-none">
                                <button
                                  onClick={() => {
                                    setEditSelectPeriodDropdown(
                                      !editSelectPeriodDropdown
                                    );
                                    setEditSelectProductDropdown(false);
                                    setEditSelectPlanDropdown(false);
                                  }}
                                  className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span className="pr-4 text-sm text-white">
                                    {editSelectedPeriod
                                      ? editSelectedPeriod
                                      : "Select period"}
                                  </span>
                                  <FiChevronDown
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  onMouseLeave={() =>
                                    setEditSelectPeriodDropdown(false)
                                  }
                                  className={`absolute right-0 z-20 ${
                                    editSelectPeriodDropdown ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                                >
                                  {periodOptions.map((period) => (
                                    <a key={period}>
                                      <p
                                        className="p-3 flex items-center text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={() =>
                                          handleEditPeriodClick(period)
                                        }
                                      >
                                        {period}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {editSuccess && (
                              <div
                                className="mt-3 bg-purple-100 border-t-2 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                                role="alert"
                              >
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-purple-100 bg-purple-200 text-purple-800 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                                      <FiCheckCircle className="flex-shrink-0 size-4" />
                                    </span>
                                  </div>
                                  <div className="ms-3">
                                    <h3 className="text-gray-800 font-semibold dark:text-white">
                                      Company Subscription Plan.
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-neutral-400">
                                      {editSuccess}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-x-2">
                    <a
                      onClick={handleEditCompanySubscription}
                      className="py-2 inline-flex items-center gap-x-2 px-2 text-sm font-medium cursor-pointer rounded-lg border border-gray-700 bg-transparent text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <FaRegPaperPlane className="size-4" />
                      Update Company Subscription Plan
                    </a>
                  </div>
                </div>
              </div>
            </Modal>

            {/* delete company subscription */}

            <Modal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              center
              classNames={{
                modal: "deleteModal",
              }}
              closeIcon
            >
              <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
                <FaTimes
                  className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                  onClick={() => setOpenDeleteModal(false)}
                />

                <div className="my-4 text-center">
                  <FaTrashAlt className="size-16 text-red-600 inline" />
                  <h4 className="text-gray-100 text-base font-semibold mt-4">
                    Are you sure you want to delete this company subscription?
                  </h4>

                  <div className="text-center space-x-4 mt-8">
                    <button
                      onClick={() => setOpenDeleteModal(false)}
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

export default Subscriptions;
