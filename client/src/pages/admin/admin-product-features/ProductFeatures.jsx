import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiCheckCircle,
  FiSave,
} from "react-icons/fi";
import { CiFilter, CiMenuKebab } from "react-icons/ci";
import {
  MdOutlineCategory,
  MdOutlineAddCircle,
  MdClose,
  MdOutlineFileUpload,
} from "react-icons/md";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import AdminNav from "../../../components/admin/admin-nav/AdminNav";
import AdminSidebar from "../../../components/admin/admin-sidebar/AdminSidebar";
import { useSidebarContext } from "../../../hooks/useSidebarContext";
import config from "../../../Functions/config";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { AiOutlineFileExcel } from "react-icons/ai";
import {
  FaTimes,
  FaTrashAlt,
  FaCheckCircle,
  FaRegFilePdf,
} from "react-icons/fa";
import AdminProductFeaturesReport from "../../../components/admin/admin-product-features-report/AdminProductFeaturesReport";
import { Modal } from "react-responsive-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-responsive-modal/styles.css";
import "./productfeatures.css";

const ProductFeatures = () => {
  const [products, setProducts] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addProductForm, setAddProductForm] = useState({
    name: "",
    description: "",
    features: "",
    images: [],
    product_id: "",
    category: "",
    price: "",
  });
  const [addCategoryForm, setAddCategoryForm] = useState({ name: "" });
  const [imagePreviews, setImagePreviews] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const [success, setSuccess] = useState("");
  const [success1, setSuccess1] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    features: "",
    images: "",
    category: "",
    product_id: "",
    price: "",
  });
  const [categoryError, setCategoryError] = useState({ name: "" });

  const { isSidebarCollapsed, dispatch: sidebarDispatch } = useSidebarContext();

  const [selectedCategory, setSelectedCategory] = useState("Choose Category");
  const [selectedCategory1, setSelectedCategory1] = useState("Category");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categoryDropdown1, setCategoryDropdown1] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 2;
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const filePickerRef = useRef();
  const navigate = useNavigate();

  const [openProductDeleteModal, setOpenProductDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const [categoryList, setCategoryList] = useState([]);
  const [categoryListDropdown, setCategoryListDropdown] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [categorySuccess, setCategorySuccess] = useState("");

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryDropdown(false);
    setAddProductForm({ ...addProductForm, category: categoryName });
    setErrors((prevErrors) => ({
      ...prevErrors,
      category: "",
    }));
  };

  const handleCategorySelect1 = (categoryName) => {
    setSelectedCategory1(categoryName);
    setCategoryDropdown1(false);
    setOffset(0);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory1("Category");
    setOffset(0);
  };

  const sidebarToggle = () => {
    sidebarDispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const fetchProducts1 = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`
      );
      if (res.status === 200) {
        setProducts1(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts1();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${config.baseApiUrl}admin/product-features/`,
        {
          params: {
            limit: LIMIT,
            offset: offset,
            search: searchTerm,
            category: selectedCategory1 === "Category" ? "" : selectedCategory1,
          },
        }
      );
      if (res.status === 200) {
        const { products, total_count } = res.data;
        setProducts(products);
        setTotalCount(total_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [offset, searchTerm, selectedCategory1]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-category/`);
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAddProductForm({ ...addProductForm, [id]: value });

    let newErrors = { ...errors };

    if (id === "name") {
      newErrors.name = value.trim() ? "" : "Name is required";
    }
    if (id === "description") {
      newErrors.description = value.trim() ? "" : "Description is required";
    }
    if (id === "features") {
      newErrors.features = value.trim() ? "" : "Features are required";
    }
    if (id === "product_id") {
      newErrors.product_id = value.trim() ? "" : "Product ID is required";

      const productExists = products1.some(
        (product) => product.product_id === value.trim()
      );
      if (productExists) {
        newErrors.product_id = "Product ID already exists";
      }
    }
    if (id === "price") {
      newErrors.price = value.trim() ? "" : "Price is required";
    }

    setErrors(newErrors);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const supportedFormats = ["image/jpeg", "image/png"];
    const maxFileSize = 1 * 1024 * 1024;
    const maxImages = 4;

    let validFiles = [];
    let previews = [];
    let errors = { images: "" };

    if (files.length > maxImages) {
      errors.images = `You can only upload a maximum of ${maxImages} images.`;
      setAddProductForm({ ...addProductForm, images: [] });
      setImagePreviews([]);
    } else {
      files.forEach((file) => {
        if (!supportedFormats.includes(file.type)) {
          errors.images += `Unsupported format: ${file.name}. Please upload JPG or PNG files. `;
          setAddProductForm({ ...addProductForm, images: [] });
          setImagePreviews([]);
        } else if (file.size > maxFileSize) {
          errors.images += `File size exceeds 1MB: ${file.name}. Please upload smaller files. `;
          setAddProductForm({ ...addProductForm, images: [] });
          setImagePreviews([]);
        } else {
          validFiles.push(file);
          previews.push(URL.createObjectURL(file));
        }
      });
    }

    if (validFiles.length > 0 && validFiles.length <= maxImages) {
      setAddProductForm({ ...addProductForm, images: validFiles });
      setImagePreviews(previews);
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const formatFeatures = (features) => {
    return features
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "")
      .join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!addProductForm.name) newErrors.name = "Name is required";
    if (!addProductForm.price) newErrors.price = "Price is required";
    if (!addProductForm.description)
      newErrors.description = "Description is required";
    if (!addProductForm.features) newErrors.features = "Features are required";
    if (addProductForm.images.length === 0)
      newErrors.images = "At least one image is required";
    if (
      !addProductForm.category ||
      addProductForm.category === "Choose Category"
    )
      newErrors.category = "Category is required";
    if (!addProductForm.product_id)
      newErrors.product_id = "Product ID is required";
    if (
      products1.some(
        (product) => product.product_id === addProductForm.product_id
      )
    ) {
      newErrors.product_id = "Product ID already exists";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedFeatures = formatFeatures(addProductForm.features);

    try {
      const formData = new FormData();
      formData.append("name", addProductForm.name);
      formData.append("description", addProductForm.description);
      formData.append("features", formattedFeatures);
      formData.append("category", addProductForm.category);
      formData.append("price", addProductForm.price);
      formData.append("product_id", addProductForm.product_id);
      addProductForm.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const res = await axios.post(
        `${config.baseApiUrl}admin/product-features/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setSuccess("Product added successfully.");
        handleClear();
        fetchProducts1();
        setTimeout(() => {
          setSuccess("");
          setOpenModal(false);
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!openModal) {
      setAddProductForm({
        name: "",
        description: "",
        features: "",
        images: [],
        category: "",
        product_id: "",
        price: "",
      });
      setErrors({
        name: "",
        description: "",
        features: "",
        images: "",
        product_id: "",
        category: "",
        price: "",
      });
      setSelectedCategory("Choose Category");
      setCategoryDropdown(false);
      setImagePreviews([]);
    }
  }, [openModal]);

  const handleCategoryChange = (e) => {
    const { id, value } = e.target;
    setAddCategoryForm({ ...addCategoryForm, [id]: value });
    if (value.trim().length > 0) {
      if (
        categories.some(
          (category) =>
            category.name.toLowerCase() === value.trim().toLowerCase()
        )
      ) {
        setCategoryError({ ...categoryError, name: "Category already exists" });
      } else {
        setCategoryError({ ...categoryError, name: "" });
      }
    } else {
      setCategoryError({ ...categoryError, name: "Category name is required" });
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!addCategoryForm.name.trim()) {
      setCategoryError({ ...errors, name: "Category name is required" });
      return;
    }
    if (
      categories.some(
        (category) =>
          category.name.toLowerCase() ===
          addCategoryForm.name.trim().toLowerCase()
      )
    ) {
      setCategoryError({ ...categoryError, name: "Category already exists" });
      return;
    }

    try {
      const res = await axios.post(
        `${config.baseApiUrl}admin/add-category/`,
        addCategoryForm
      );
      if (res.status === 200) {
        setSuccess("Category added successfully.");
        setTimeout(() => {
          setSuccess("");
          setOpenCategoryModal(false);
          fetchCategories();
          fetchCategoryList();
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  useEffect(() => {
    if (!openCategoryModal) {
      setAddCategoryForm({ name: "" });
      setCategoryError({ name: "" });
    }
  }, [openCategoryModal]);

  useEffect(() => {
    setExcelData(
      products.map(
        ({
          name,
          description,
          features,
          product_id,
          availability_status,
          price,
          created_at,
          category,
          images,
          id,
          ...rest
        }) => ({
          PRODUCT_ID: product_id,
          NAME: name,
          DESCRIPTION: description,
          FEATURES: features,
          PRICE: price,
          AVAILABILITY_STATUS: availability_status,
          CATEGORY: category.name,
          CREATED_AT: new Date(created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        })
      )
    );
  }, [products]);

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
    saveAs(blob, "products-details.xlsx");
  };

  const handleEdit = (product) => {
    navigate(`/admin/product-features-details/${product.id}`);
  };

  const handleDelete = (pid) => {
    setProductIdToDelete(pid);
    setOpenProductDeleteModal(true);
  };

  const confirmDeleteProduct = async (pid) => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/product-features/details/${pid}/`
      );
      if (res.status === 200) {
        setSuccess1(res.data.message);
        fetchProducts1();
        handleClear();
        setTimeout(() => {
          setSuccess1("");
          setOpenProductDeleteModal(false);
          setProductIdToDelete(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const res = await axios.get(`${config.baseApiUrl}admin/add-category/`);
      if (res.status === 200) {
        setCategoryList(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const toogleCategoryListDropdown = () => {
    setCategoryListDropdown(!categoryListDropdown);
    setCategoryDropdown1(false);
  };

  useEffect(() => {
    if (!categoryListDropdown) {
      setEditCategoryId(null);
      setEditCategoryName("");
      setDeleteCategoryId(null);
    }
  }, [categoryListDropdown]);

  const handleEditCategoryClick = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleDeleteCategoryClick = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setDeleteCategoryModal(true);
  };

  const handleEditCategory = async (categoryId) => {
    try {
      const res = await axios.put(
        `${config.baseApiUrl}admin/update-category/${categoryId}/`,
        { name: editCategoryName }
      );
      if (res.status === 200) {
        setCategoryList((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, name: editCategoryName } : cat
          )
        );
        setEditCategoryId(null);
        setEditCategoryName("");
        fetchCategories();
        fetchCategoryList();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const res = await axios.delete(
        `${config.baseApiUrl}admin/update-category/${categoryId}/`
      );
      if (res.status === 200) {
        setCategoryList((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== categoryId)
        );
        setCategorySuccess(res.data.message);
        fetchCategories();
        setTimeout(() => {
          setCategorySuccess("");
          setDeleteCategoryModal(false);
          setDeleteCategoryId(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const confirmDeleteCategory = () => {
    handleDeleteCategory(deleteCategoryId);
  };

  const handleDownloadPdf = () => {
    const newProducts = products.map((product) => ({
      ...product,
      features: formatFeatures(product.features),
    }));

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const tableColumn = [
      "PRODUCT_ID",
      "NAME",
      "DESCRIPTION",
      "FEATURES",
      "PRICE",
      "AVAILABILITY_STATUS",
      "CATEGORY",
      "CREATED_AT",
    ];

    const tableRows = newProducts.map((product) => [
      product.product_id,
      product.name,
      product.description,
      product.features,
      product.price,
      product.availability_status,
      product.category.name,
      new Date(product.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    ]);

    doc.setFontSize(12);
    doc.text("Product Listing with Details", 20, 30);

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
        1: { cellWidth: 100 },
        2: { cellWidth: 120 },
        3: { cellWidth: 120 },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
        7: { cellWidth: "auto" },
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

    doc.save("products.pdf");
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
                <li className="bg-purple-600 text-white text-nowrap underline rounded-r-full z-10 px-8 py-3 text-base cursor-pointer">
                  <Link to="/admin/product-features">Product & Features </Link>
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
                            Products and Features
                          </h2>
                          <p className="text-sm text-white dark:text-neutral-400">
                            Here are the products and can be added, deleted and
                            updated.
                          </p>
                          <div className="sm:col-span-1 mt-2">
                            <label className="sr-only">Search</label>
                            <div className="relative">
                              <input
                                type="text"
                                id="search"
                                name="search"
                                className="py-2 px-3 ps-11 text-white block w-full bg-slate-900 border-gray-700 rounded-lg text-sm focus:border-purple-600 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                placeholder="Search by product name"
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
                          <div className="flex md:justify-end gap-2">
                            <button
                              onClick={() => setOpenModal(true)}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <FiPlus className="flex-shrink-0 size-4 text-slate-950 dark:text-neutral-500" />
                              Add new product
                            </button>
                            <button
                              onClick={() => setOpenCategoryModal(true)}
                              className="py-3 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-purple-700 text-slate-950 hover:bg-purple-700 bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              <FiPlus className="flex-shrink-0 size-4 text-slate-950 dark:text-neutral-500" />
                              Add new category
                            </button>
                          </div>
                          <div className="flex gap-2 md:justify-end flex-wrap">
                            <div className="relative w-48  h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                              <button
                                onClick={() => {
                                  setCategoryDropdown1(!categoryDropdown1);
                                  setCategoryListDropdown(false);
                                }}
                                className="relative flex items-center justify-between w-full px-5 py-2 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                              >
                                <span className="pr-4 text-sm text-white">
                                  {selectedCategory1}
                                </span>
                                <FiChevronDown
                                  id="rotate1"
                                  className="absolute z-10 cursor-pointer right-5 text-white"
                                  size={14}
                                />
                              </button>
                              <div
                                className={`absolute right-0 z-20 ${
                                  categoryDropdown1 ? "" : "hidden"
                                } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                              >
                                {categories.map((category) => (
                                  <a key={category.id}>
                                    <p
                                      className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                      onClick={() =>
                                        handleCategorySelect1(category.name)
                                      }
                                    >
                                      {category.name}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleClear}
                                type="button"
                                className="py-2 px-4 text-white inline-flex items-center gap-x-1 hover:bg-gray-800 focus:bg-transparent focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-sm rounded-lg border border-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                              >
                                <CiFilter className="size-4 text-white" />
                                Clear
                              </button>
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
                          </div>
                          <div>
                            <div className="relative rounded-lg w-max mx-auto">
                              <button
                                type="button"
                                className="px-4 py-3 rounded-lg flex justify-center items-center bg-purple-600 hover:bg-purple-700 text-slate-950 text-sm font-medium border-purple-700 outline-none transition duration-300 ease-in-out transform"
                                onClick={toogleCategoryListDropdown}
                              >
                                Category list
                                <FiChevronDown
                                  className="inline ml-3 size-5 transition-transform duration-300 ease-in-out transform"
                                  style={{
                                    transform: categoryListDropdown
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  }}
                                />
                              </button>

                              {categoryListDropdown && (
                                <ul className="absolute shadow-xl bg-slate-900 border border-gray-800 mt-2 xl:right-0 py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto transition-opacity duration-300 ease-in-out opacity-100">
                                  {categoryList.map((category) => (
                                    <li
                                      key={category.id}
                                      className="py-2.5 px-5 text-white text-sm cursor-pointer flex justify-between items-center transition-transform duration-300 ease-in-out transform"
                                    >
                                      {editCategoryId === category.id ? (
                                        <input
                                          type="text"
                                          value={editCategoryName}
                                          onChange={(e) =>
                                            setEditCategoryName(e.target.value)
                                          }
                                          className="px-2 py-1 rounded-lg bg-transparent border border-gray-700 focus:border-purple-600 focus:ring-0 focus:outline-none transition-transform duration-300 ease-in-out transform"
                                        />
                                      ) : (
                                        <span>{category.name}</span>
                                      )}
                                      <div className="flex items-center ml-14 space-x-2">
                                        {editCategoryId === category.id ? (
                                          <button
                                            className="text-green-700 hover:underline"
                                            onClick={() =>
                                              handleEditCategory(category.id)
                                            }
                                          >
                                            <FiSave className="size-5 transition-transform duration-300 ease-in-out transform hover:scale-125" />
                                          </button>
                                        ) : (
                                          <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() =>
                                              handleEditCategoryClick(category)
                                            }
                                          >
                                            <FiEdit className="size-4 transition-transform duration-300 ease-in-out transform hover:scale-125" />
                                          </button>
                                        )}
                                        <button
                                          className="text-red-600 hover:underline"
                                          onClick={() =>
                                            handleDeleteCategoryClick(
                                              category.id
                                            )
                                          }
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

                      <table className="min-w-full divide-y divide-gray-700 dark:divide-neutral-700">
                        <thead className="bg-gray-800 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              PID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Image
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Product Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-white"
                            >
                              Status
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
                          {products.map((product, index) => (
                            <tr key={product.id}>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.product_id}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.images.length > 0 && (
                                  <PhotoProvider
                                    bannerVisible={false}
                                    speed={() => 300}
                                  >
                                    <PhotoView
                                      src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                      key={0}
                                    >
                                      <img
                                        src={`${config.baseApiImageUrl}${product.images[0].image}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded cursor-pointer"
                                      />
                                    </PhotoView>
                                  </PhotoProvider>
                                )}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                {product.category.name}
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-0.5 rounded text-sm font-semibold ${
                                    product.availability_status === "In Stock"
                                      ? "text-green-400 border border-green-400"
                                      : product.availability_status ===
                                        "Out of Stock"
                                      ? "text-red-400 border border-red-400"
                                      : "text-yellow-400 border border-yellow-400"
                                  }`}
                                >
                                  {product.availability_status}
                                </span>
                              </td>
                              <td
                                className="px-6 py-3 whitespace-nowrap text-end"
                                onMouseLeave={() => setOpenDropdown(null)}
                              >
                                <div className="relative flex justify-center text-left w-full">
                                  <div className="relative group rounded-xl w-fit border border-gray-700">
                                    <button
                                      onClick={() => toggleDropdown(product.id)}
                                      type="button"
                                      className="bg-primary flex items-center rounded-lg px-3 py-2 text-base font-medium"
                                    >
                                      <CiMenuKebab className="rotate-90 text-white" />
                                    </button>
                                    {openDropdown === product.id && (
                                      <div
                                        onMouseLeave={() =>
                                          setOpenDropdown(null)
                                        }
                                        className="absolute mt-1 right-0 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10"
                                      >
                                        <button
                                          onClick={() => handleEdit(product)}
                                          className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-700 w-full text-left flex items-center"
                                        >
                                          <FiEdit className="mr-2" />
                                          Edit / View
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDelete(product.id)
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
                              {products.length}{" "}
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
            <AdminProductFeaturesReport />
          </div>
          {/* add new prodduct modal */}

          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            center
            classNames={{
              modal: "productfeatures",
            }}
            closeIcon
          >
            <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl">
              <div className="relative overflow-hidden min-h-36 bg-gray-900 text-center">
                <div className="absolute top-2 end-2">
                  <button
                    onClick={() => setOpenModal(false)}
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
                      className="fill-white"
                      d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                    ></path>
                  </svg>
                </figure>
              </div>

              <div className="relative z-10 -mt-12">
                <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm">
                  <MdOutlineCategory className="size-8 text-gray-800" />
                </span>
              </div>

              <div className="p-4 overflow-y-auto">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    Add Product
                  </h3>
                </div>
                <div className="px-4 py-10 mx-auto w-full">
                  <div className="mt-0 w-full mx-auto">
                    <div className="flex flex-col border border-gray-700 rounded-xl p-8 dark:border-neutral-700">
                      <h2 className="mb-8 text-xl font-semibold text-white">
                        Fill the product details
                      </h2>
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mb-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product name"
                            required
                            value={addProductForm.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div className="mb-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product ID
                          </label>
                          <input
                            type="text"
                            id="product_id"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product id"
                            required
                            value={addProductForm.product_id}
                            onChange={handleChange}
                          />
                          {errors.product_id && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.product_id}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mb-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows="4"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="description"
                            value={addProductForm.description}
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
                            value={addProductForm.features}
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
                      <div className="flex md:flex-row flex-col md:gap-4">
                        <div className="mt-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Category
                          </label>
                          <div className="relative  h-fit border border-gray-700 rounded-lg outline-none dropdown-one">
                            <button
                              onClick={() =>
                                setCategoryDropdown(!categoryDropdown)
                              }
                              className="relative flex items-center justify-between w-full px-3 py-2.5 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 rounded-lg hover:bg-gray-800 focus:bg-transparent"
                            >
                              <span className="pr-4 text-sm text-white">
                                {selectedCategory}
                              </span>
                              <FiChevronDown
                                id="rotate1"
                                className="absolute z-10 cursor-pointer right-5 text-white"
                                size={14}
                              />
                            </button>
                            <div
                              className={`absolute right-0 z-20 ${
                                categoryDropdown ? "" : "hidden"
                              } w-full px-1 py-2 bg-white border-t border-gray-200 rounded shadow top-12 max-h-28 overflow-y-scroll select`}
                            >
                              {categories.map((category) => (
                                <a key={category.id}>
                                  <p
                                    className="p-3 text-sm leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded"
                                    onClick={() =>
                                      handleCategorySelect(category.name)
                                    }
                                  >
                                    {category.name}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                          {errors.category && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.category}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 w-full">
                          <label className="block mb-2 text-sm text-white font-medium">
                            Product Price
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                            placeholder="product price"
                            required
                            value={addProductForm.price}
                            onChange={handleChange}
                          />
                          {errors.price && (
                            <p className="text-red-600 text-sm font-medium">
                              {errors.price}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block mb-2 text-sm text-white font-medium dark:text-white">
                          Upload Images
                        </label>
                        <input
                          ref={filePickerRef}
                          type="file"
                          id="images"
                          name="images"
                          onChange={handleImageChange}
                          className="file-input file-input-bordered border border-gray-700 rounded-md text-white w-full focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
                          multiple
                          required
                          accept="image/*"
                          hidden
                        />
                        <button
                          onClick={() => filePickerRef.current.click()}
                          className="flex items-center gap-4 w-full p-2.5 border border-gray-700 rounded-md text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 hover:bg-gray-800"
                        >
                          <MdOutlineFileUpload className="size-5" />
                          <p className="text-sm">
                            Upload single or multiple images
                          </p>
                        </button>
                        <span className="text-gray-400 text-xs">
                          {addProductForm.images.length} file(s) selected
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          ( Please upload images in JPG or PNG format, each not
                          exceeding 1MB in size. You can upload a maximum of 4
                          images )
                        </p>
                        {errors.images && (
                          <p className="text-red-600 text-sm font-medium">
                            {errors.images}
                          </p>
                        )}
                        <div className="w-full flex gap-4 flex-wrap mt-2">
                          {imagePreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`preview-${index}`}
                              className="w-20 object-cover rounded-md h-20"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {success && (
                    <div
                      className="mt-3 bg-gray-700 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="inline-flex justify-center items-center size-8 rounded-full border-2 border-purple-700 bg-purple-700 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                            <FiCheckCircle className="flex-shrink-0 size-4 text-white dark:text-neutral-500" />
                          </span>
                        </div>
                        <div className="ms-3">
                          <h3 className="text-white font-semibold dark:text-white">
                            Product and Features.
                          </h3>
                          <p className="text-sm text-white dark:text-neutral-400">
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
                    Add Product
                  </a>
                </div>
              </div>
            </div>
          </Modal>

          {/* add category modal */}

          <Modal
            open={openCategoryModal}
            onClose={() => setOpenCategoryModal(false)}
            center
            classNames={{
              modal: "productfeaturescategory",
            }}
            closeIcon
          >
            <div className="relative flex flex-col bg-gray-900 shadow-lg rounded-xl dark:bg-neutral-800 border-none">
              <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center">
                <div className="absolute top-2 end-2">
                  <button
                    onClick={() => setOpenCategoryModal(false)}
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
                  <MdOutlineCategory className="size-8 text-gray-800" />
                </span>
              </div>

              <div className="p-4 overflow-y-auto">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">
                    Add Category
                  </h3>
                </div>
                <div className="px-4 py-10 mx-auto w-full">
                  <div className="mt-0 w-full mx-auto">
                    <div className="flex flex-col border border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 dark:border-neutral-700">
                      <h2 className="mb-8 text-xl font-semibold text-white">
                        Fill the category name
                      </h2>
                      <div className="mb-2">
                        <label className="block mb-2 text-sm text-white font-medium">
                          Category Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="bg-transparent border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
                          placeholder="Category name"
                          required
                          value={addCategoryForm.name}
                          onChange={handleCategoryChange}
                        />
                        {categoryError.name && (
                          <p className="text-red-600 text-sm font-medium">
                            {categoryError.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {success && (
                    <div
                      className="mt-3 bg-gray-700 border-t-4 border-purple-600 rounded-lg p-4 dark:bg-purple-800/30"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <span className="inline-flex justify-center items-center size-8 rounded-full border-2 border-purple-700 bg-purple-700 dark:border-purple-900 dark:bg-purple-800 dark:text-purple-400">
                            <FiCheckCircle className="flex-shrink-0 size-4 text-white dark:text-neutral-500" />
                          </span>
                        </div>
                        <div className="ms-3">
                          <h3 className="text-white font-semibold dark:text-white">
                            Product and Features.
                          </h3>
                          <p className="text-sm text-white dark:text-neutral-400">
                            {success}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-x-2">
                  <a
                    onClick={handleCategorySubmit}
                    className="p-2.5 inline-flex items-center gap-x-2 text-sm font-medium cursor-pointer rounded-md border border-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <MdOutlineAddCircle className="size-5" />
                    Add Category
                  </a>
                </div>
              </div>
            </div>
          </Modal>

          {/* delete product modal */}

          <Modal
            open={openProductDeleteModal}
            onClose={() => setOpenProductDeleteModal(false)}
            center
            classNames={{
              modal: "deleteModal",
            }}
            closeIcon
          >
            <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
              <FaTimes
                className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                onClick={() => setOpenProductDeleteModal(false)}
              />

              <div className="my-4 text-center">
                <FaTrashAlt className="size-16 text-red-600 inline" />
                <h4 className="text-gray-200 text-base font-semibold mt-4">
                  Are you sure you want to delete this product?
                </h4>

                <div className="text-center space-x-4 mt-8">
                  <button
                    onClick={() => setOpenProductDeleteModal(false)}
                    type="button"
                    className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(productIdToDelete)}
                    type="button"
                    className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {success1 && (
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
                      <div className="text-sm font-medium">{success1}</div>
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

          {/* delete category modal */}

          <Modal
            open={deleteCategoryModal}
            onClose={() => setDeleteCategoryModal(false)}
            center
            classNames={{
              modal: "deleteModal",
            }}
            closeIcon
          >
            <div className="w-full max-w-lg bg-gray-900 shadow-lg rounded-lg p-6 relative">
              <FaTimes
                className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
                onClick={() => setDeleteCategoryModal(false)}
              />

              <div className="my-4 text-center">
                <FaTrashAlt className="size-16 text-red-600 inline" />
                <h4 className="text-gray-200 text-base font-semibold mt-4">
                  Are you sure you want to delete this category?
                </h4>

                <div className="text-center space-x-4 mt-8">
                  <button
                    onClick={() => setDeleteCategoryModal(false)}
                    type="button"
                    className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteCategory}
                    type="button"
                    className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {categorySuccess && (
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
                        {categorySuccess}
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
    </>
  );
};

export default ProductFeatures;
