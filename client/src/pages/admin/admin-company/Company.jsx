import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { CiFilter } from "react-icons/ci";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import {
  MdBusiness,
  MdClose,
  MdOutlineAccountCircle,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { FaSync, FaTimes, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import "./company.css";

const Company = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [editOpenModal, setEditOpenModal] = useState(false);
  const onOpenEditModal = () => setEditOpenModal(true);
  const onCloseEditModal = () => setEditOpenModal(false);
  const [editedCompanyId, setEditedCompanyId] = useState(null);

  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const onOpenDeleteModal = () => setDeleteOpenModal(true);
  const onCloseDeleteModal = () => setDeleteOpenModal(false);
  const [companyIdToDelete, setCompanyIdToDelete] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sector, setSector] = useState("");
  const [sortByDate, setSortByDate] = useState("");
  const [createCompanyForm, setCreateCompanyForm] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    sector: "",
  });

  const [editCompanyForm, setEditCompanyForm] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    sector: "",
  });

  const [errors, setErrors] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    sector: "",
  });

  const [editErrors, setEditErrors] = useState({
    company_name: "",
    phone: "",
    email: "",
    username: "",
    sector: "",
  });

  const [selectedLayout, setSelectedLayout] = useState("Sector");
  const [selectedLayout1, setSelectedLayout1] = useState("Date");
  const [selectedLayout2, setSelectedLayout2] = useState("Sector");
  const [selectedLayout3, setSelectedLayout3] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [dropdownVisible2, setDropdownVisible2] = useState(false);
  const [dropdownVisible3, setDropdownVisible3] = useState(false);
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
  const [selectorDate, setSectorDate] = useState([
    "Oldest First",
    "Newest First",
  ]);
  const [offset, setOffset] = useState(0);
  const LIMIT = 1;
  const [hasMore, setHasMore] = useState(true);

  const [options, setOptions] = useState([
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

  const [success, setSuccess] = useState("");
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const showDropDownMenuOne_form_layout_wizard3 = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const swaptextone_form_layout_wizard3 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout(targetText);
    setDropdownVisible(false);
    if (e.target.innerText !== "Sector") {
      setSector(e.target.innerText);
      setOffset(0);
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

  const showDropDownMenuOne_form_layout_wizard4 = () => {
    setDropdownVisible1(!dropdownVisible1);
  };

  const swaptextone_form_layout_wizard4 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout1(targetText);
    setDropdownVisible1(false);
    if (e.target.innerText !== "Date") {
      if (e.target.innerText === "Oldest First") {
        setSortByDate("asc");
        setOffset(0);
      } else {
        setSortByDate("desc");
        setOffset(0);
      }
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
    if (targetText !== "Sector") {
      setCreateCompanyForm((prevData) => ({
        ...prevData,
        sector: targetText,
      }));

      validateField("sector", targetText);
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
    if (targetText) {
      setEditCompanyForm((prevData) => ({
        ...prevData,
        sector: targetText,
      }));
      validateEditFiled("sector", targetText);
    }
  };

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
    fetchCompanies();
  }, [searchTerm, sector, sortByDate, offset]);

  const fetchCompanies = async () => {
    try {
      const params = {
        company_name: searchTerm,
        sector: sector,
        sort_by_date: sortByDate,
        limit: LIMIT,
        offset,
      };
      const res = await axios.get(`${config.baseApiUrl}companies/`, {
        params,
      });
      if (res.status === 200) {
        const newCompanies = res.data;
        if (offset === 0) {
          setCompanies(newCompanies);
        } else {
          setCompanies((prevCompanies) => [...prevCompanies, ...newCompanies]);
        }
        setHasMore(newCompanies.length === LIMIT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSector("");
    setSortByDate("");
    setSelectedLayout("Sector");
    setSelectedLayout1("Date");
    setOffset(0);
  };

  const loadMoreCompanies = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCreateCompanyForm({ ...createCompanyForm, [id]: value });

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
      sector: "",
    };

    if (!createCompanyForm.company_name.trim()) {
      newErrors.company_name = "Company name is required.";
      isValid = false;
    } else if (
      companyUsers.some(
        (user) => user.company_name === createCompanyForm.company_name
      )
    ) {
      newErrors.company_name = "Company name already exists";
      isValid = false;
    }

    if (!createCompanyForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(createCompanyForm.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    } else if (
      companyUsers.some((user) => user.phone === createCompanyForm.phone)
    ) {
      newErrors.phone = "Phone number already exists";
      isValid = false;
    }

    if (!createCompanyForm.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(createCompanyForm.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else if (
      companyUsers.some((user) => user.email === createCompanyForm.email)
    ) {
      newErrors.email = "Email already exists";
      isValid = false;
    }

    if (!createCompanyForm.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (
      companyUsers.some((user) => user.username === createCompanyForm.username)
    ) {
      newErrors.username = "Username already exists";
      isValid = false;
    }

    if (!createCompanyForm.sector) {
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
          `${config.baseApiUrl}admin/create/company/`,
          createCompanyForm
        );
        if (res.status === 200) {
          handleClear();
          fetchCompaniesAfterCreation();
          fetchCompanyUsers();
          setSuccess("Company account created successfully");
          setSelectedLayout2("Sector");
          setCreateCompanyForm({
            company_name: "",
            phone: "",
            email: "",
            username: "",
            sector: "",
          });
          setTimeout(() => {
            setSuccess("");
            onCloseModal();
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchCompaniesAfterCreation = async () => {
    try {
      const params = {
        company_name: "",
        sector: "",
        sort_by_date: "",
        limit: LIMIT,
        offset: 0,
      };
      const res = await axios.get(`${config.baseApiUrl}companies/`, {
        params,
      });
      if (res.status === 200) {
        const newCompanies = res.data;
        setCompanies(newCompanies);
        setHasMore(newCompanies.length === LIMIT);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleEdit = (companyId) => {
    const companyDetails = companies.find(
      (company) => company.id === companyId
    );
    if (companyDetails) {
      setEditCompanyForm({
        company_name: companyDetails.company_name,
        phone: companyDetails.phone,
        email: companyDetails.email,
        username: companyDetails.username,
        sector: companyDetails.sector,
      });
      onOpenEditModal();
      setEditedCompanyId(companyDetails.id);
      setSelectedLayout3(companyDetails.sector);
    }
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditCompanyForm({ ...editCompanyForm, [id]: value });

    validateEditFiled(id, value);
  };

  const validateEditFiled = (id, value) => {
    let errorMessage = "";

    switch (id) {
      case "company_name":
        if (!value.trim()) {
          errorMessage = "Company name is required";
        } else if (
          companyUsers.some(
            (user) => user.company_name === value && user.id !== editedCompanyId
          )
        ) {
          errorMessage = "Company name already exists";
        }
        break;

      case "phone":
        if (!value.trim()) {
          errorMessage = "Phone number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "Phone number must be 10 digits";
        } else if (
          companyUsers.some(
            (user) => user.phone === value && user.id !== editedCompanyId
          )
        ) {
          errorMessage = "Phone number already exists";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Email is invalid";
        } else if (
          companyUsers.some(
            (user) => user.email === value && user.id !== editedCompanyId
          )
        ) {
          errorMessage = "Email already exists";
        }
        break;

      case "username":
        if (!value.trim()) {
          errorMessage = "Username is required";
        } else if (
          companyUsers.some(
            (user) => user.username === value && user.id !== editedCompanyId
          )
        ) {
          errorMessage = "Username already exists";
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

    setEditErrors((prevErrors) => ({ ...prevErrors, [id]: errorMessage }));
  };

  const validateEditForm = () => {
    let isValid = true;
    const newErrors = {
      company_name: "",
      phone: "",
      email: "",
      username: "",
      sector: "",
    };

    if (!editCompanyForm.company_name.trim()) {
      newErrors.company_name = "Company name is required.";
      isValid = false;
    } else if (
      companyUsers.some(
        (user) =>
          user.company_name === editCompanyForm.company_name &&
          user.id !== editedCompanyId
      )
    ) {
      newErrors.company_name = "Company name already exists";
      isValid = false;
    }

    if (!editCompanyForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(editCompanyForm.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    } else if (
      companyUsers.some(
        (user) =>
          user.phone === editCompanyForm.phone && user.id !== editedCompanyId
      )
    ) {
      newErrors.phone = "Phone number already exists";
      isValid = false;
    }

    if (!editCompanyForm.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editCompanyForm.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else if (
      companyUsers.some(
        (user) =>
          user.email === editCompanyForm.email && user.id !== editedCompanyId
      )
    ) {
      newErrors.email = "Email already exists";
      isValid = false;
    }

    if (!editCompanyForm.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (
      companyUsers.some(
        (user) =>
          user.username === editCompanyForm.username &&
          user.id !== editedCompanyId
      )
    ) {
      newErrors.username = "Username already exists";
      isValid = false;
    }

    if (!editCompanyForm.sector) {
      newErrors.sector = "Sector is required";
      isValid = false;
    }

    setEditErrors(newErrors);

    return isValid;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateEditForm();

    if (isFormValid) {
      try {
        const res = await axios.put(
          `${config.baseApiUrl}admin/update/company/${editedCompanyId}/`,
          editCompanyForm
        );
        if (res.status === 200) {
          if (searchTerm === "" && sector === "" && sortByDate === "") {
            const updatedCompanies = companies.map((company) =>
              company.id === editedCompanyId
                ? {
                    ...company,
                    company_name: res.data.company_name,
                    phone: res.data.phone,
                    email: res.data.email,
                    username: res.data.username,
                    sector: res.data.sector,
                  }
                : company
            );
            setCompanies(updatedCompanies);
          } else {
            handleClear();
            fetchCompanyUsers();
            fetchCompaniesAfterCreation();
          }
          setSuccess("Company account updated successfully");
          setSelectedLayout3("Sector");
          setEditCompanyForm({
            company_name: "",
            phone: "",
            email: "",
            username: "",
            sector: "",
          });
          setTimeout(() => {
            setSuccess("");
            onCloseEditModal();
            fetchCompanyUsers();
            setEditedCompanyId(null);
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setErrors({
      company_name: "",
      phone: "",
      email: "",
      username: "",
      sector: "",
    });
    setCreateCompanyForm({
      company_name: "",
      phone: "",
      email: "",
      username: "",
      sector: "",
    });
  }, [!open]);

  useEffect(() => {
    setEditErrors({
      company_name: "",
      phone: "",
      email: "",
      username: "",
      sector: "",
    });
  }, [!editOpenModal]);

  const handleDelete = (companyId) => {
    setCompanyIdToDelete(companyId);
    onOpenDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/delete/company/${companyIdToDelete}/`
      );
      if (res.status === 200) {
        setCompanies(
          companies.filter((company) => company.id !== companyIdToDelete)
        );
        setSuccess("Company has been successfully deleted.");
        handleClear();
        fetchCompanyUsers();
        fetchCompanies();
        setCompanyIdToDelete(null);
        setTimeout(() => {
          setSuccess("");
          onCloseDeleteModal();
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
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
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/company">Company</Link>
                </li>
              </ul>
            </div>

            <div className="">
              <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="bg-slate-900 shadow-gray-500 border border-gray-700 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-400 dark:border-neutral-700">
                          <div>
                            <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                              Companies
                            </h2>
                            <p className="text-sm text-white dark:text-neutral-400">
                              Here are the registered companies and can be
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
                                  placeholder="Search by company name"
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
                              <div className="inline-flex gap-x-2">
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
                                  Add Company
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard3
                                  }
                                  className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard3"
                                  >
                                    {selectedLayout}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
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
                                        onClick={
                                          swaptextone_form_layout_wizard3
                                        }
                                      >
                                        {sector}
                                      </p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              <div className="relative w-40 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                                <button
                                  onClick={
                                    showDropDownMenuOne_form_layout_wizard4
                                  }
                                  className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                                >
                                  <span
                                    className="pr-4 text-sm text-white"
                                    id="drop-down-content-setter-one_form_layout_wizard4"
                                  >
                                    {selectedLayout1}
                                  </span>
                                  <FiChevronDown
                                    id="rotate1"
                                    className="absolute z-10 cursor-pointer right-5 text-white"
                                    size={14}
                                  />
                                </button>
                                <div
                                  className={`absolute right-0 z-20 ${
                                    dropdownVisible1 ? "" : "hidden"
                                  } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-10 max-h-40 select`}
                                  id="drop-down-div-one_form_layout_wizard4"
                                >
                                  {selectorDate.map((date, index) => (
                                    <a key={index}>
                                      <p
                                        className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                        onClick={
                                          swaptextone_form_layout_wizard4
                                        }
                                      >
                                        {date}
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
                              <th scope="col" className="ps-6 py-3 text-start">
                                <label
                                  htmlFor="hs-at-with-checkboxes-main"
                                  className="flex"
                                >
                                  <input
                                    type="checkbox"
                                    className="shrink-0 border-gray-700 bg-slate-900 rounded text-purple-600 focus:ring-purple-600 focus:ring-1"
                                  />
                                  <span className="sr-only">Checkbox</span>
                                </label>
                              </th>
                              <th
                                scope="col"
                                className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                              >
                                <div className="flex items-center gap-x-2 pl-1">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Name
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Email
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Phone
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Sector
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Registered Date
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Status
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 w-max">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Log In
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-start">
                                <div className="flex items-center gap-x-2 w-max">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Log Out
                                  </span>
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-end">
                                <span className="text-xs font-semibold uppercase tracking-wide text-white">
                                  Action
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            className="divide-y divide-gray-700 dark:divide-neutral-700"
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            {companies.map((company) => (
                              <tr key={company.id}>
                                <td className="size-px whitespace-nowrap">
                                  <div className="ps-6 py-3">
                                    <label
                                      htmlFor={`checkbox-${company.id}`}
                                      className="flex"
                                    >
                                      <input
                                        type="checkbox"
                                        className="shrink-0 border-gray-700 bg-transparent rounded text-purple-600 focus:ring-purple-500 focus:ring-1"
                                        id={`checkbox-${company.id}`}
                                      />
                                      <span className="sr-only">Checkbox</span>
                                    </label>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                                    <div className="flex items-center gap-x-3">
                                      <img
                                        className="inline-block size-[38px] rounded-full"
                                        src={`${config.baseApiImageUrl}${company.profile}`}
                                        alt={company.company_name}
                                      />
                                      <div className="grow">
                                        <span className="block text-sm font-semibold text-white">
                                          {company.company_name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {company.email}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {company.phone}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {company.sector}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {new Date(
                                        company.register_date
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className=" text-green-400 text-sm font-medium me-2 px-2.5 py-0.5 rounded border border-green-400">
                                      {company.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {company.log_in
                                        ? new Date(
                                            company.log_in
                                          ).toLocaleString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-white">
                                      {company.log_out
                                        ? new Date(
                                            company.log_out
                                          ).toLocaleString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="size-px whitespace-nowrap">
                                  <div className="relative flex justify-center text-left w-full ">
                                    <div className="reative group rounded-xl w-fit border border-gray-700">
                                      <button
                                        onClick={() =>
                                          toggleDropdown(company.id)
                                        }
                                        type="button"
                                        className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                      >
                                        <CiMenuKebab className="rotate-90 text-white" />
                                      </button>
                                      {openDropdown === company.id && (
                                        <div
                                          onMouseLeave={() =>
                                            setOpenDropdown(null)
                                          }
                                          className="absolute mt-1 right-5 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                        >
                                          <button
                                            onClick={() =>
                                              handleEdit(company.id)
                                            }
                                            className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-700 w-full text-left flex items-center"
                                          >
                                            <MdEdit className="mr-2" />
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDelete(company.id)
                                            }
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-700 w-full text-left"
                                          >
                                            <MdDelete className="mr-2" />
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
                                {companies.length}{" "}
                              </span>
                              results
                            </p>
                          </div>

                          <div>
                            <div className="inline-flex gap-x-2">
                              <button
                                onClick={loadMoreCompanies}
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
            </div>

            {/* create company modal */}

            <div className="">
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
                      <MdBusiness className="size-8 text-gray-800" />
                    </span>
                  </div>

                  <div className="p-4 sm:p-7 overflow-y-auto">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white dark:text-neutral-200">
                        Create Company
                      </h3>
                    </div>
                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                      <div className="mt-0 w-full mx-auto">
                        <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                          <h2 className="mb-8 text-xl font-semibold text-white dark:text-neutral-200">
                            Fill the company details
                          </h2>
                          <div>
                            <div className="grid gap-4 lg:gap-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                    Company Name
                                  </label>
                                  <input
                                    type="text"
                                    id="company_name"
                                    className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="company name"
                                    required
                                    value={createCompanyForm.company_name}
                                    onChange={handleChange}
                                  />
                                  {errors.company_name && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {errors.company_name}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                    Contact Number
                                  </label>
                                  <div className="flex items-center">
                                    <button
                                      id="phone-button"
                                      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-transparent border border-gray-700 rounded-s-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
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
                                        <rect
                                          width="20"
                                          height="5"
                                          fill="#FF7F00"
                                        />
                                        <rect
                                          y="5"
                                          width="20"
                                          height="5"
                                          fill="#FFFFFF"
                                        />
                                        <rect
                                          y="10"
                                          width="20"
                                          height="5"
                                          fill="#00B140"
                                        />
                                        <circle
                                          cx="10"
                                          cy="7.5"
                                          r="1.5"
                                          fill="#0000FF"
                                        />
                                        <circle
                                          cx="10"
                                          cy="7.5"
                                          r="1"
                                          fill="#FFFFFF"
                                        />
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
                                        className="block p-2.5 w-full z-20 text-sm text-white bg-transparent rounded-e-lg border-s-0 border border-gray-700 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-600"
                                        pattern="[0-9]{10}"
                                        placeholder="mobile"
                                        required
                                        value={createCompanyForm.phone}
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    id="email"
                                    className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="company.name@gmail.com"
                                    required
                                    value={createCompanyForm.email}
                                    onChange={handleChange}
                                  />
                                  {errors.email && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {errors.email}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    id="username"
                                    className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="username"
                                    required
                                    value={createCompanyForm.username}
                                    onChange={handleChange}
                                  />
                                  {errors.username && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {errors.username}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                                  Sector
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
                                    {options.map((sector, index) => (
                                      <a key={index}>
                                        <p
                                          className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                          onClick={
                                            swaptextone_form_layout_wizard5
                                          }
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
                        <FiUser className="size-5" />
                        Create
                      </a>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>

            {/* edit company modal */}

            <div className="">
              <Modal
                open={editOpenModal}
                onClose={() => setEditOpenModal(false)}
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
                      <MdBusiness className="size-8 text-gray-800" />
                    </span>
                  </div>

                  <div className="p-4 sm:p-7 overflow-y-auto">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white">
                        Update Company
                      </h3>
                    </div>
                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto w-full">
                      <div className="mt-0 w-full mx-auto">
                        <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                          <h2 className="mb-8 text-xl font-semibold text-white">
                            Fill the company details
                          </h2>
                          <div>
                            <div className="grid gap-4 lg:gap-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium">
                                    Company Name
                                  </label>
                                  <input
                                    type="text"
                                    id="company_name"
                                    className=" bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="company name"
                                    required
                                    value={editCompanyForm.company_name}
                                    onChange={handleEditChange}
                                  />
                                  {editErrors.company_name && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {editErrors.company_name}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium">
                                    Contact Number
                                  </label>
                                  <div className="flex items-center">
                                    <button
                                      id="phone-button"
                                      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-transparent border border-gray-700 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
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
                                        <rect
                                          width="20"
                                          height="5"
                                          fill="#FF7F00"
                                        />
                                        <rect
                                          y="5"
                                          width="20"
                                          height="5"
                                          fill="#FFFFFF"
                                        />
                                        <rect
                                          y="10"
                                          width="20"
                                          height="5"
                                          fill="#00B140"
                                        />
                                        <circle
                                          cx="10"
                                          cy="7.5"
                                          r="1.5"
                                          fill="#0000FF"
                                        />
                                        <circle
                                          cx="10"
                                          cy="7.5"
                                          r="1"
                                          fill="#FFFFFF"
                                        />
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
                                        className="block p-2.5 w-full z-20 text-sm text-white bg-transparent rounded-e-lg border-s-0 border border-gray-700 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-purple-600"
                                        pattern="[0-9]{10}"
                                        placeholder="mobile"
                                        required
                                        value={editCompanyForm.phone}
                                        onChange={handleEditChange}
                                      />
                                    </div>
                                  </div>
                                  {editErrors.phone && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {editErrors.phone}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium">
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    id="email"
                                    className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="company.name@gmail.com"
                                    required
                                    value={editCompanyForm.email}
                                    onChange={handleEditChange}
                                  />
                                  {editErrors.email && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {editErrors.email}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block mb-2 text-sm text-white font-medium">
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    id="username"
                                    className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                                    placeholder="username"
                                    required
                                    value={editCompanyForm.username}
                                    onChange={handleEditChange}
                                  />
                                  {editErrors.username && (
                                    <p className="text-red-600 text-sm font-medium">
                                      {editErrors.username}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block mb-2 text-sm text-white font-medium">
                                  Sector
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
                                    {options.map((sector, index) => (
                                      <a key={index}>
                                        <p
                                          className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                          onClick={
                                            swaptextone_form_layout_wizard6
                                          }
                                        >
                                          {sector}
                                        </p>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                                {editErrors.sector && (
                                  <p className="text-red-600 text-sm font-medium">
                                    {editErrors.sector}
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
                        onClick={handleEditSubmit}
                        className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <FaSync className="size-3" />
                        Update
                      </a>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>

            {/* delete modal */}

            <div className="">
              <Modal
                open={deleteOpenModal}
                onClose={() => setDeleteOpenModal(false)}
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
                      Are you sure you want to delete this company?
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
      </div>
    </>
  );
};

export default Company;
