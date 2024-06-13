import axios from "axios";
import { useState, useEffect } from "react";
import Preline from "../../preline/Preline";
import { CiFilter } from "react-icons/ci";
import "./company.css";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sector, setSector] = useState("");
  const [sortByDate, setSortByDate] = useState("");

  const [selectedLayout, setSelectedLayout] = useState("Sector");
  const [selectedLayout1, setSelectedLayout1] = useState("Date");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const [sectorOptions, setSectorOptions] = useState([
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Real Estate",
    "Energy",
    "Consumer Goods",
    "Utilities",
    "Industrials",
    "Telecommunication",
  ]);
  const [selectorDate, setSectorDate] = useState([
    "Oldest First",
    "Newest First",
  ]);

  const showDropDownMenuOne_form_layout_wizard3 = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const swaptextone_form_layout_wizard3 = (e) => {
    const targetText = e.target.innerText;
    setSelectedLayout(targetText);
    setDropdownVisible(false);
    if (e.target.innerText !== "Sector") {
      setSector(e.target.innerText);
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
      } else {
        setSortByDate("desc");
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

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, sector, sortByDate]);

  const fetchCompanies = async () => {
    try {
      const params = {
        company_name: searchTerm,
        sector: sector,
        sort_by_date: sortByDate,
      };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}companies/`, {
        params,
      });
      setCompanies(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSector("");
    setSortByDate("");
    setSelectedLayout("Sector");
    setSelectedLayout1("Date");
  };

  console.log(companies);

  return (
    <>
      <Preline />
      <div className="">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        Companies
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Here are the registered companies and can be added,
                        deleted and updated.
                      </p>
                      <div className="sm:col-span-1 mt-2">
                        <label
                          htmlFor="hs-as-table-product-review-search"
                          className="sr-only"
                        >
                          Search
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="hs-as-table-product-review-search"
                            name="hs-as-table-product-review-search"
                            className="py-2 px-3 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                            <svg
                              className="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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

                    <div className="flex gap-x-2">
                      <div>
                        <button
                          onClick={handleClear}
                          type="button"
                          className="py-3 px-4 inline-flex items-center gap-x-1 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        >
                          <svg
                            className="flex-shrink-0 size-3.5 me-1"
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
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                          </svg>
                          Clear
                        </button>
                      </div>
                      <div className="relative w-48 border border-gray-300 rounded-lg outline-none dropdown-one">
                        <button
                          onClick={showDropDownMenuOne_form_layout_wizard3}
                          className="relative flex items-center justify-between w-full px-5 py-4"
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
                          className={`absolute right-0 mt-2 z-20 ${
                            dropdownVisible ? "" : "hidden"
                          } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-40 overflow-y-scroll select`}
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
                      <div className="relative w-48 border border-gray-300 rounded-lg outline-none dropdown-one">
                        <button
                          onClick={showDropDownMenuOne_form_layout_wizard4}
                          className="relative flex items-center justify-between w-full px-5 py-4"
                        >
                          <span
                            className="pr-4 text-sm text-gray-900"
                            id="drop-down-content-setter-one_form_layout_wizard4"
                          >
                            {selectedLayout1}
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
                          className={`absolute right-0 mt-2 z-20 ${
                            dropdownVisible1 ? "" : "hidden"
                          } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-40 select`}
                          id="drop-down-div-one_form_layout_wizard4"
                        >
                          {selectorDate.map((date, index) => (
                            <a key={index}>
                              <p
                                className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                onClick={swaptextone_form_layout_wizard4}
                              >
                                {date}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="inline-flex gap-x-2">
                        <button className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none">
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
                  </div>

                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th scope="col" className="ps-6 py-3 text-start">
                          <label
                            htmlFor="hs-at-with-checkboxes-main"
                            className="flex"
                          >
                            <input
                              type="checkbox"
                              className="shrink-0 border-gray-300 rounded text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
                              id="hs-at-with-checkboxes-main"
                            />
                            <span className="sr-only">Checkbox</span>
                          </label>
                        </th>
                        <th
                          scope="col"
                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                        >
                          <div className="flex items-center gap-x-2 pl-1">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Name
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Email
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Phone
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Sector
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Registered Date
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Status
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 w-max">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Log In
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 w-max">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Log Out
                            </span>
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-end">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Action
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
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
                                  className="shrink-0 border-gray-300 rounded text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-purple-500 dark:checked:border-purple-500 dark:focus:ring-offset-gray-800"
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
                                  src={`${import.meta.env.VITE_API_IMAGE_URL}${
                                    company.profile
                                  }`}
                                  alt={company.company_name}
                                />
                                <div className="grow">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {company.company_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {company.email}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {company.phone}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {company.sector}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {new Date(
                                  company.register_date
                                ).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                {company.status}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {company.log_in
                                  ? new Date(company.log_in).toLocaleString()
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {company.log_out
                                  ? new Date(company.log_out).toLocaleString()
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-1.5 text-end">
                              <a
                                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                                href="#"
                              >
                                Edit
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-800 dark:text-neutral-200">
                          {companies.length}
                        </span>
                        results
                      </p>
                    </div>

                    <div>
                      <div className="inline-flex gap-x-2">
                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                            <path d="M15 18L9 12l6-6" />
                          </svg>
                          Prev
                        </button>

                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        >
                          Next
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
                            <path d="M9 18l6-6-6-6" />
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
    </>
  );
};

export default Company;
