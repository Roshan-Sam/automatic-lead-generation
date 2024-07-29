import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../Functions/config";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { Link } from "react-router-dom";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import { FiSearch, FiTrash, FiChevronDown } from "react-icons/fi";
import { CiMenuKebab, CiFilter } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FaTimes, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Modal } from "react-responsive-modal";
import AdminPurchaseSalesReport from "../../../components/admin/admin-purchase-sales-report/AdminPurchaseSalesReport";
import "react-responsive-modal/styles.css";
import "./purchasesales.css";

const sectors = [
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
];

const PurchaseSales = () => {
  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();
  const [offset, setOffset] = useState(0);
  const LIMIT = 2;
  const [totalCount, setTotalCount] = useState(0);
  const [purchaseSales, setPurchaseSales] = useState([]);
  const [companies, setCompanie] = useState([]);
  const [products, setProducts] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Select Product");
  const [selectedCompany, setSelectedCompany] = useState("Select Company");
  const [selectedSector, setSelectedSector] = useState("Select Sector");

  const [openMenuDropdown, setOpenMenuDropdown] = useState(null);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [statusChangeDropdown, setStatusChangeDropdown] = useState(null);
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deletedPurchaseSalesId, setDeletedPurchaseSalesId] = useState(null);

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchPurchaseSalesData = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-purchase-sales/`,
        {
          params: {
            limit: LIMIT,
            offset: offset,
            search: searchTerm,
            product:
              selectedProduct === "Select Product" ? "" : selectedProduct,
            company:
              selectedCompany === "Select Company" ? "" : selectedCompany,
            sector: selectedSector === "Select Sector" ? "" : selectedSector,
          },
        }
      );
      if (res.status === 200) {
        const { purchases, total_count } = res.data;
        setPurchaseSales(purchases);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPurchaseSalesData();
  }, [offset, searchTerm, selectedProduct, selectedCompany, selectedSector]);

  const fetchCompaniesAndProducts = async () => {
    try {
      const companyRes = await axios.get(`${config.baseApiUrl}companies/`);
      if (companyRes.status === 200) {
        setCompanie(companyRes.data);
      }
      const productRes = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (productRes.status === 200) {
        setProducts(productRes.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompaniesAndProducts();
  }, []);

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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const toggleMenuDropdown = (id) => {
    setOpenMenuDropdown((prevOpenMenuDropdown) =>
      prevOpenMenuDropdown === id ? null : id
    );
  };

  const handleDelete = async (id) => {
    setOpenDeleteModal(true);
    setDeletedPurchaseSalesId(id);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/product-purchase-sales/${deletedPurchaseSalesId}/delete/`
      );
      if (res.status === 200) {
        setDeleteSuccess(
          "Product purchase sales details successfully deleted."
        );
        if (
          searchTerm === "" &&
          selectedCompany === "Select Company" &&
          selectedProduct === "Select Product" &&
          selectedSector === "Select Sector"
        ) {
          setPurchaseSales((prevPurchaseSales) =>
            prevPurchaseSales.filter(
              (purchase) => purchase.id !== deletedPurchaseSalesId
            )
          );
        } else {
          handleClear();
          fetchCompaniesAndProducts();
        }
        setTimeout(() => {
          setOpenDeleteModal(false);
          setDeleteSuccess("");
          setDeletedPurchaseSalesId(null);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product.name);
    setProductDropdownOpen(false);
    setOffset(0);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.company_name);
    setCompanyDropdownOpen(false);
    setOffset(0);
  };

  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    setSectorDropdownOpen(false);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCompany("Select Company");
    setSelectedProduct("Select Product");
    setSelectedSector("Select Sector");
    setOffset(0);
  };

  const toggleStatusChange = (id) => {
    setStatusChangeDropdown((prevStatusChangeDropdown) =>
      prevStatusChangeDropdown === id ? null : id
    );
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.patch(
        `${config.baseApiUrl}admin/product-purchase-sales/${id}/update/`,
        {
          status,
        }
      );
      if (res.status === 200) {
        if (
          searchTerm === "" &&
          selectedCompany === "Select Company" &&
          selectedProduct === "Select Product" &&
          selectedSector === "Select Sector"
        ) {
          setPurchaseSales((prevPurchaseSales) =>
            prevPurchaseSales.map((purchase) =>
              purchase.id === id ? { ...purchase, status } : purchase
            )
          );
        } else {
          handleClear();
          fetchCompaniesAndProducts();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadPdf = () => {
    const newPurchases = purchaseSales.map((purchase) => ({
      ...purchase,
      purchase_date: new Date(purchase.purchase_date).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      ),
      amount: `Rs ${purchase.amount}`,
    }));

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const tableColumn = [
      "PURCHASE_ID",
      "PRODUCT_NAME",
      "COMPANY_NAME",
      "QUANTITY",
      "PURCHASE_DATE",
      "STATUS",
      "AMOUNT",
    ];

    const tableRows = newPurchases.map((purchase) => [
      purchase.purchase_id,
      purchase.product.name,
      purchase.company.company_name,
      purchase.quantity,
      purchase.purchase_date,
      purchase.status,
      purchase.amount,
    ]);

    doc.setFontSize(12);
    doc.text("Product Purchase Sales Details", 20, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: { top: 3, right: 8, bottom: 3, left: 2 },
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [52, 58, 64],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
      },
      didDrawPage: function (data) {
        let str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          str,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
      margin: { top: 20 },
      pageBreak: "auto",
    });

    doc.save("product_purchase_sales.pdf");
  };

  useEffect(() => {
    setExcelData(
      purchaseSales.map(
        ({
          purchase_id,
          product,
          company,
          quantity,
          purchase_date,
          status,
          amount,
          ...rest
        }) => ({
          PURCHASE_ID: purchase_id,
          PRODUCT_NAME: product.name,
          COMPANY_NAME: company.company_name,
          QUANTITY: quantity,
          PURCHASE_DATE: new Date(purchase_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          STATUS: status,
          AMOUNT: `₹${amount}`,
        })
      )
    );
  }, [purchaseSales]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "product_purchase_sales_details.xlsx");
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
            <div className="flex pt-10 px-4 overflow-x-auto">
              <ul className="bg-slate-900 border border-gray-700 rounded-full py-2 px-4 -space-x-4 w-max flex items-center mt-4">
                <li className="bg-gray-800 text-purple-500 hover:underline rounded-full z-40 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="bg-purple-600 text-white underline rounded-r-full z-10 px-8 py-3 text-nowrap text-base cursor-pointer">
                  <Link to="/admin/product-purchase-sales">
                    Product Purchase & Sales
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-white px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-slate-900 shadow-gray-500 border border-gray-700 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 gap-3 flex xl:flex-row flex-col xl:justify-between xl:items-center border-b border-gray-400 dark:border-neutral-700">
                        <div>
                          <h2 className="text-xl font-semibold text-white dark:text-neutral-200">
                            Product Purchase and Sales
                          </h2>
                          <p className="text-sm text-white dark:text-neutral-400">
                            Here are the products purchase and sales details and
                            can be view, delete, share, and download.
                          </p>
                          <div className="sm:col-span-1 mt-2">
                            <label className="sr-only">Search</label>
                            <div className="relative">
                              <input
                                type="text"
                                id="search"
                                name="search"
                                className="py-2 px-3 ps-11 text-white block w-full bg-slate-900 border-gray-700 rounded-lg text-sm focus:border-purple-600 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Search by product name, company name, status"
                                value={searchTerm}
                                onChange={handleSearchChange}
                              />
                              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                                <FiSearch className="flex-shrink-0 size-4 text-slate-400 dark:text-neutral-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col xl:items-end items-start gap-4">
                          <div className="flex gap-2 md:justify-end">
                            <button
                              onClick={handleDownloadPdf}
                              type="button"
                              className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              <FaRegFilePdf className="size-4 fill-white" />
                              Export pdf
                            </button>
                            <button
                              onClick={handleDownloadExcel}
                              type="button"
                              className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              <AiOutlineFileExcel className="size-5 fill-white" />
                              Export excel
                            </button>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap justify-end">
                            <div className="relative w-64 h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                              <button
                                onClick={() => {
                                  setCompanyDropdownOpen(!companyDropdownOpen);
                                  setProductDropdownOpen(false);
                                  setSectorDropdownOpen(false);
                                }}
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedCompany}
                                </span>
                                <FiChevronDown
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  companyDropdownOpen ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {companies.map((company) => (
                                  <a key={company.id}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() =>
                                        handleCompanySelect(company)
                                      }
                                    >
                                      {company.company_name}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>

                            <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-two">
                              <button
                                onClick={() => {
                                  setProductDropdownOpen(!productDropdownOpen);
                                  setCompanyDropdownOpen(false);
                                  setSectorDropdownOpen(false);
                                }}
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedProduct}
                                </span>
                                <FiChevronDown
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  productDropdownOpen ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {products.map((product) => (
                                  <a key={product.id}>
                                    <p
                                      className="flex items-center p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() =>
                                        handleProductSelect(product)
                                      }
                                    >
                                      <img
                                        src={`${config.baseApiImageUrl}${product.images[0]?.image}`}
                                        alt={product.name}
                                        className="w-6 h-6 mr-2 rounded-full"
                                      />
                                      {product.name}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>

                            <div className="relative w-48 h-fit border border-gray-700 rounded-lg outline-none dropdown-three">
                              <button
                                onClick={() => {
                                  setSectorDropdownOpen(!sectorDropdownOpen);
                                  setProductDropdownOpen(false);
                                  setCompanyDropdownOpen(false);
                                }}
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedSector}
                                </span>
                                <FiChevronDown
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  sectorDropdownOpen ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {sectors.map((sector, index) => (
                                  <a key={index}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() => handleSectorSelect(sector)}
                                    >
                                      {sector}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>
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

                      <table className="min-w-full divide-y divide-gray-700 dark:divide-neutral-700">
                        <thead className="bg-gray-800 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Purchase ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Product ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Company ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Purchase Date
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
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 dark:divide-neutral-700">
                          {purchaseSales.map((purchase) => (
                            <tr key={purchase.id}>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {purchase.purchase_id}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {purchase.product.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {purchase.company.company_name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {new Date(
                                  purchase.purchase_date
                                ).toLocaleString("en-US", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded text-sm font-semibold ${
                                    purchase.status === "Completed"
                                      ? "text-green-400 border border-green-400"
                                      : purchase.status === "Pending"
                                      ? "text-yellow-400 border border-yellow-400"
                                      : "text-red-400 border border-red-400"
                                  }`}
                                >
                                  {purchase.status}
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
                                      toggleStatusChange(purchase.id)
                                    }
                                  >
                                    {purchase.status} <FiChevronDown />
                                  </button>
                                  {statusChangeDropdown === purchase.id && (
                                    <div
                                      onMouseLeave={() =>
                                        setStatusChangeDropdown(null)
                                      }
                                      className="absolute mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20"
                                    >
                                      {["Pending", "Completed"].map(
                                        (status) => (
                                          <button
                                            key={status}
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                                            onClick={() =>
                                              handleStatusChange(
                                                purchase.id,
                                                status
                                              )
                                            }
                                          >
                                            {status}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {purchase.quantity}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                ₹ {purchase.amount}
                              </td>
                              <td
                                className="px-6 py-3 whitespace-nowrap text-end"
                                onMouseLeave={() => setOpenMenuDropdown(null)}
                              >
                                <div className="relative flex justify-center text-left w-full">
                                  <div className="relative group rounded-xl w-fit border border-gray-700">
                                    <button
                                      onClick={() =>
                                        toggleMenuDropdown(purchase.id)
                                      }
                                      type="button"
                                      className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                    >
                                      <CiMenuKebab className="rotate-90 text-white" />
                                    </button>
                                    {openMenuDropdown === purchase.id && (
                                      <div
                                        onMouseLeave={() =>
                                          setOpenMenuDropdown(null)
                                        }
                                        className="absolute mt-1 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                      >
                                        <button
                                          onClick={() =>
                                            handleDelete(purchase.id)
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
                              {purchaseSales.length}{" "}
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
            <AdminPurchaseSalesReport />
          </div>
        </div>
      </div>

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
              Are you sure you want to delete this product purchase details?
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
                  <div className="text-sm font-medium">{deleteSuccess}</div>
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

export default PurchaseSales;
