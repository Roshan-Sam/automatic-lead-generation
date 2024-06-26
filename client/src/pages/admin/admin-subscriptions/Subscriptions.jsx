import axios from "axios";
import { useState, useEffect } from "react";
import { FiChevronDown, FiEdit, FiTrash, FiBell } from "react-icons/fi";
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
  const [subScriptionPlans, setSubscriptionPlans] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openDropdown1, setOpenDropdown1] = useState(null);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [open1, setOpen1] = useState(false);
  const onOpenModal1 = () => setOpen1(true);
  const onCloseModal1 = () => setOpen1(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onOpenDeleteModal = () => setOpenDeleteModal(true);
  const onCloseDeleteModal = () => setOpenDeleteModal(false);
  const [success, setSuccess] = useState("");
  const [createSubForm, setCreateSubForm] = useState({
    company_name: "",
    subscription_plan: "",
    start_date: "",
    end_date: "",
  });
  const [updateSubForm, setUpdateSubForm] = useState({
    subscription_plan: "",
    start_date: "",
    end_date: "",
  });
  const [editingCompanySubscription, setEditingCompanySubscription] = useState(
    {}
  );
  const [deleteCompanySubscriptionId, setDeleteCompanySubscriptionId] =
    useState(null);
  const [errors, setErrors] = useState({});
  const [errors1, setErrors1] = useState({});
  const [selectedLayout1, setSelectedLayout1] = useState("Company");
  const [selectedLayout2, setSelectedLayout2] = useState("Subscription Plan");
  const [selectedLayout3, setSelectedLayout3] = useState("Period");
  const [selectedLayout4, setSelectedLayout4] = useState("Subscription Plan");
  const [selectedLayout5, setSelectedLayout5] = useState("Period");
  const [selectedLayout6, setSelectedLayout6] = useState("Status");
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible3, setDropdownVisible3] = useState(false);
  const [dropdownVisible4, setDropdownVisible4] = useState(false);
  const [dropdownVisible5, setDropdownVisible5] = useState(false);
  const [dropdownVisible6, setDropdownVisible6] = useState(false);
  const [periodOptions, setPeriodOptions] = useState([
    "Monthly",
    "Annual",
    "Custom",
  ]);
  const [statusOptions, setStatusOptions] = useState([
    "Active",
    "Pending",
    "Inactive",
    "Canceled",
  ]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 2;
  const [hasMore, setHasMore] = useState(true);
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchCompanySubscriptions = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/subscriptions/`, {
        params: {
          search: searchTerm,
          status: status,
          limit: LIMIT,
          offset: offset,
        },
      });
      if (res.status === 200) {
        const newCompanySubscriptions = res.data;
        if (offset === 0) {
          setCompanySubscriptions(res.data);
        } else {
          setCompanySubscriptions((prevCompanySubscriptions) => [
            ...prevCompanySubscriptions,
            ...newCompanySubscriptions,
          ]);
        }
        setHasMore(newCompanySubscriptions.length === LIMIT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompaniesAndPlans = async () => {
    try {
      const companyRes = await axios.get(`${config.baseApiUrl}companies/`);
      setCompanies(companyRes.data);

      const subScriptionsRes = await axios.get(
        `${config.baseApiUrl}admin/create-subscription-plan/`
      );
      setSubscriptionPlans(subScriptionsRes.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanySubscriptions();
  }, [searchTerm, offset, status]);

  useEffect(() => {
    fetchCompaniesAndPlans();
  }, []);

  const calculatePeriod = (start_date, end_date) => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 30 || diffDays === 31) return "1 Month";
    if (diffDays === 365) return "1 Year";
    return `${diffDays} Days`;
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
    setOpenDropdown1(null);
  };

  const toggleDropdown1 = (id) => {
    setOpenDropdown1(openDropdown1 === id ? null : id);
    setOpenDropdown(null);
  };

  const showDropDownMenuOne_form_layout_wizard4 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const swaptextone_form_layout_wizard4 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout1(targetText);
    setDropdownVisible1(false);
    if (targetText !== "Company") {
      const selectedCompany = companies.find(
        (company) => company.company_name === targetText
      );
      setCreateSubForm((prevData) => ({
        ...prevData,
        company_name: selectedCompany.id,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        company_name: "",
      }));
    }
  };

  const handleOutsideClick1 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard4"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard4"
    ) {
      setDropdownVisible1(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick1);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick1);
    };
  }, []);

  const showDropDownMenuOne_form_layout_wizard5 = () => {
    setDropdownVisible2(!dropdownVisible2);
  };

  const swaptextone_form_layout_wizard5 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout2(targetText);
    setDropdownVisible2(false);
    if (targetText !== "Subscription Plan") {
      const selectedPlan = subScriptionPlans.find(
        (plan) => plan.plan_name === targetText
      );
      setCreateSubForm((prevData) => ({
        ...prevData,
        subscription_plan: selectedPlan.id,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        subscription_plan: "",
      }));
    }
  };

  const handleOutsideClick2 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard5"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard5"
    ) {
      setDropdownVisible2(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick2);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick2);
    };
  }, []);

  const showDropDownMenuOne_form_layout_wizard6 = () => {
    setDropdownVisible3(!dropdownVisible3);
  };

  const swaptextone_form_layout_wizard6 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout3(targetText);
    setDropdownVisible3(false);

    if (
      targetText !== "Period" &&
      selectedLayout2 !== "" &&
      selectedLayout2 !== "Subscription Plan"
    ) {
      const startDate = new Date();
      let endDate;

      if (targetText === "Monthly") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (targetText === "Annual") {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        const selectedPlan = subScriptionPlans.find(
          (plan) => plan.id === createSubForm.subscription_plan
        );
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + selectedPlan.duration_in_months);
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      setCreateSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate.toLocaleDateString("en-CA"),
      }));
    }
  };

  useEffect(() => {
    if (selectedLayout3 !== "" && selectedLayout3 !== "Period") {
      const startDate = new Date();
      let endDate;
      if (selectedLayout3 === "Monthly") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (selectedLayout3 === "Annual") {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        const selectedPlan = subScriptionPlans.find(
          (plan) => plan.id === createSubForm.subscription_plan
        );
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + selectedPlan.duration_in_months);
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      setCreateSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate.toLocaleDateString("en-CA"),
      }));
    }
  }, [selectedLayout2]);

  const handleOutsideClick3 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard6"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard6"
    ) {
      setDropdownVisible3(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick3);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick3);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedLayout1("Company");
      setSelectedLayout2("Subscription Plan");
      setSelectedLayout3("Period");
      setCreateSubForm({
        company_name: "",
        subscription_plan: "",
        start_date: "",
        end_date: "",
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};

    if (!createSubForm.company_name) {
      newErrors.company_name = "Company is required";
    }

    if (!createSubForm.subscription_plan) {
      newErrors.subscription_plan = "Subscription plan is required";
    }

    if (selectedLayout3 === "Period") {
      newErrors.period = "Period is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedLayout3 !== "Period") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        period: "",
      }));
    }
  }, [selectedLayout3]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${config.baseApiUrl}admin/subscriptions/`,
        createSubForm
      );
      if (response.status === 200) {
        setSuccess("Company Subscription created successfully.");
        handleClear();
        fetchCompaniesAndPlans();
        fetchCompanySubscriptionsAfterCreation();
        setTimeout(() => {
          setSuccess("");
          onCloseModal();
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
          search: searchTerm,
          status: status,
          limit: LIMIT,
          offset: 0,
        },
      });
      if (res.status === 200) {
        const newCompanySubscriptions = res.data;
        setCompanySubscriptions(newCompanySubscriptions);
        setHasMore(newCompanySubscriptions.length === LIMIT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${config.baseApiUrl}admin/subscriptions/${id}/update/`,
        { status: newStatus }
      );
      if (searchTerm === "" && status === "") {
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
        fetchCompanySubscriptionsAfterCreation();
        setOpenDropdown1(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const showDropDownMenuOne_form_layout_wizard7 = () => {
    setDropdownVisible4(!dropdownVisible4);
  };

  const swaptextone_form_layout_wizard7 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout4(targetText);
    setDropdownVisible4(false);
    if (targetText !== "Subscription Plan") {
      const selectedPlan = subScriptionPlans.find(
        (plan) => plan.plan_name === targetText
      );
      setUpdateSubForm((prevData) => ({
        ...prevData,
        subscription_plan: selectedPlan.id,
      }));
      setErrors1((prevErrors) => ({
        ...prevErrors,
        subscription_plan: "",
      }));
    }
  };

  const handleOutsideClick4 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard7"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard7"
    ) {
      setDropdownVisible4(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick4);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick4);
    };
  }, []);

  const showDropDownMenuOne_form_layout_wizard8 = () => {
    setDropdownVisible5(!dropdownVisible5);
  };

  const swaptextone_form_layout_wizard8 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout5(targetText);
    setDropdownVisible5(false);

    if (
      targetText !== "Period" &&
      selectedLayout4 !== "" &&
      selectedLayout4 !== "Subscription Plan"
    ) {
      const startDate = new Date();
      let endDate;

      if (targetText === "Monthly") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (targetText === "Annual") {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        const selectedPlan = subScriptionPlans.find(
          (plan) => plan.id === updateSubForm.subscription_plan
        );
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + selectedPlan.duration_in_months);
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      setUpdateSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate.toLocaleDateString("en-CA"),
      }));
    }
  };

  useEffect(() => {
    if (selectedLayout5 !== "" && selectedLayout5 !== "Period") {
      const startDate = new Date();
      let endDate;
      if (selectedLayout5 === "Monthly") {
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (selectedLayout5 === "Annual") {
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        const selectedPlan = subScriptionPlans.find(
          (plan) => plan.id === updateSubForm.subscription_plan
        );
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + selectedPlan.duration_in_months);
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      setUpdateSubForm((prevData) => ({
        ...prevData,
        start_date: startDate.toLocaleDateString("en-CA"),
        end_date: endDate.toLocaleDateString("en-CA"),
      }));
    }
  }, [selectedLayout4]);

  const handleOutsideClick5 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard8"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard8"
    ) {
      setDropdownVisible5(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick5);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick5);
    };
  }, []);

  useEffect(() => {
    if (selectedLayout5 !== "Period") {
      setErrors1((prevErrors) => ({
        ...prevErrors,
        period: "",
      }));
    }
  }, [selectedLayout5]);

  useEffect(() => {
    if (!open1) {
      setSelectedLayout4("Subscription Plan");
      setSelectedLayout5("Period");
      setUpdateSubForm({
        subscription_plan: "",
        start_date: "",
        end_date: "",
      });
      setErrors1({});
      setEditingCompanySubscription({});
    }
  }, [open1]);

  const handleEdit = (id) => {
    const editedCompanySub = companySubscriptions.find(
      (item) => item.id === id
    );
    setEditingCompanySubscription(editedCompanySub);
    onOpenModal1();
  };

  const validateUpdateForm = () => {
    const newErrors1 = {};

    if (!updateSubForm.subscription_plan) {
      newErrors1.subscription_plan = "Subscription plan is required";
    }

    if (selectedLayout5 === "Period") {
      newErrors1.period = "Period is required";
    }

    setErrors1(newErrors1);
    return Object.keys(newErrors1).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateUpdateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        `${config.baseApiUrl}admin/subscriptions/${editingCompanySubscription.id}/update/`,
        updateSubForm
      );
      if (response.status === 200) {
        setSuccess("Company subscription updated successfully.");
        if (searchTerm === "" && status === "") {
          setCompanySubscriptions((prevSubscriptions) =>
            prevSubscriptions.map((subscription) =>
              subscription.id === editingCompanySubscription.id
                ? response.data
                : subscription
            )
          );
        } else {
          handleClear();
          fetchCompanySubscriptionsAfterCreation();
          fetchCompaniesAndPlans();
        }
        setTimeout(() => {
          setSuccess("");
          onCloseModal1();
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteCompanySubscriptionId(id);
    onOpenDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${config.baseApiUrl}admin/subscriptions/${deleteCompanySubscriptionId}/delete/`
      );
      if (response.status === 200) {
        setSuccess("Company subscription deleted successfully.");
        handleClear();
        fetchCompanySubscriptionsAfterCreation();
        fetchCompaniesAndPlans();
        setTimeout(() => {
          setSuccess("");
          onCloseDeleteModal();
          setDeleteCompanySubscriptionId(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  const showDropDownMenuOne_form_layout_wizard9 = () => {
    setDropdownVisible6(!dropdownVisible6);
  };

  const swaptextone_form_layout_wizard9 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout6(targetText);
    setDropdownVisible6(false);
    if (e.target.innerText !== "Status") {
      setStatus(e.target.innerText);
      setOffset(0);
    }
  };

  const handleOutsideClick6 = (e) => {
    const dropdown = document.getElementById(
      "drop-down-div-one_form_layout_wizard9"
    );
    if (
      dropdown &&
      !dropdown.contains(e.target) &&
      e.target.id !== "drop-down-content-setter-one_form_layout_wizard9"
    ) {
      setDropdownVisible6(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick6);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick6);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatus("");
    setSelectedLayout6("Status");
    setOffset(0);
  };

  const loadMoreCompanySubscriptions = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
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
                                <svg
                                  className="flex-shrink-0 size-4 text-slate-400 dark:text-neutral-500"
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
                                  <circle cx="11" cy="11" r="8" />
                                  <path d="m21 21-4.3-4.3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex md:justify-end">
                            <button
                              onClick={onOpenModal}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
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
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                              </svg>
                              Add New Subscription
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                              <button
                                onClick={
                                  showDropDownMenuOne_form_layout_wizard9
                                }
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span
                                  className="pr-4 text-sm text-white"
                                  id="drop-down-content-setter-one_form_layout_wizard9"
                                >
                                  {selectedLayout6}
                                </span>
                                <FiChevronDown
                                  id="rotate1"
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  dropdownVisible6 ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-10 max-h-28 overflow-y-scroll select`}
                                id="drop-down-div-one_form_layout_wizard9"
                              >
                                {statusOptions.map((status, index) => (
                                  <a key={index}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={swaptextone_form_layout_wizard9}
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
                                {subscription.company_name.company_name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {subscription.subscription_plan.plan_name}
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
                                )}
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
                                onMouseLeave={() => setOpenDropdown1(null)}
                              >
                                <div className="relative">
                                  <button
                                    className="flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white px-3 py-2"
                                    onClick={() =>
                                      toggleDropdown1(subscription.id)
                                    }
                                  >
                                    {subscription.status} <FiChevronDown />
                                  </button>
                                  {openDropdown1 === subscription.id && (
                                    <div
                                      onMouseLeave={() =>
                                        setOpenDropdown1(null)
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
                                onMouseLeave={() => setOpenDropdown(null)}
                              >
                                <div className="relative flex justify-center text-left w-full">
                                  <div className="relative group rounded-xl w-fit border border-gray-700">
                                    <button
                                      onClick={() =>
                                        toggleDropdown(subscription.id)
                                      }
                                      type="button"
                                      className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                    >
                                      <CiMenuKebab className="rotate-90 text-white" />
                                    </button>
                                    {openDropdown === subscription.id && (
                                      <div
                                        onMouseLeave={() =>
                                          setOpenDropdown(null)
                                        }
                                        className="absolute mt-1 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                      >
                                        <button
                                          onClick={() =>
                                            handleEdit(subscription.id)
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
                          <div className="inline-flex gap-x-2">
                            <button
                              onClick={loadMoreCompanySubscriptions}
                              disabled={!hasMore}
                              type="button"
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-700 text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              Load Next
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
                                <path d="M5 9l6 6 6-6" />
                              </svg>
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
              open={open}
              onClose={() => setOpen(false)}
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
                          Fill the subscription details
                        </h2>
                        <div>
                          <div className="flex flex-col">
                            <div>
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Company Name
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard4
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard4"
                                  >
                                    {selectedLayout1}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible1 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard4"
                                >
                                  {companies.map((company, id) => (
                                    <a key={id}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard4
                                        }
                                      >
                                        {company.company_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.company_name && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.company_name}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Subscription Plan
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard5
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard5"
                                  >
                                    {selectedLayout2}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible2 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard5"
                                >
                                  {subScriptionPlans.map((subscription, id) => (
                                    <a key={id}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard5
                                        }
                                      >
                                        {subscription.plan_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors.subscription_plan && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors.subscription_plan}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Period
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard6
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard6"
                                  >
                                    {selectedLayout3}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible3 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard6"
                                >
                                  {periodOptions.map((period, index) => (
                                    <a key={index}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard6
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
                                  Company account.
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

            {/* edit company subscription */}

            <Modal
              open={open1}
              onClose={() => setOpen1(false)}
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
                      onClick={onCloseModal1}
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
                      Update Company subscription
                    </h3>
                  </div>
                  <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                    <div className="mt-0 w-full mx-auto">
                      <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                        <h2 className="mb-8 text-xl font-semibold text-white dark:text-neutral-200">
                          Update the subscription plan and period
                        </h2>
                        <div>
                          <div className="flex flex-col">
                            <div>
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Company Name
                              </label>
                              <input
                                type="text"
                                id="company_name"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                placeholder="company name"
                                required
                                value={
                                  editingCompanySubscription?.company_name
                                    ?.company_name || ""
                                }
                                readOnly
                              />
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Subscription Plan
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard7
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard7"
                                  >
                                    {selectedLayout4}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible4 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard7"
                                >
                                  {subScriptionPlans.map((subscription, id) => (
                                    <a key={id}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard7
                                        }
                                      >
                                        {subscription.plan_name}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors1.subscription_plan && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors1.subscription_plan}
                                </p>
                              )}
                            </div>

                            <div className="mt-4">
                              <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                Period
                              </label>
                              <div className="relative h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard8
                                  }
                                  className="relative flex items-center justify-between w-full p-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard8"
                                  >
                                    {selectedLayout5}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5"
                                    size={14}
                                    color="white"
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible5 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-24 overflow-y-scroll select`}
                                  id="drop-down-div-one_form_layout_wizard8"
                                >
                                  {periodOptions.map((period, index) => (
                                    <a key={index}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard8
                                        }
                                      >
                                        {period}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              {errors1.period && (
                                <p className="text-red-600 text-sm font-medium">
                                  {errors1.period}
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
                                  Company account.
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
                      onClick={handleUpdate}
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
                  <h4 className="text-gray-100 text-base font-semibold mt-4">
                    Are you sure you want to delete this company subscription?
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
